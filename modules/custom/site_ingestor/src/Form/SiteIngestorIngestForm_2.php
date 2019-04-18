<?php

/**
 * @file
 * Contains \Drupal\site_ingestor\Form\SiteIngestorIngestForm_2.
 */

namespace Drupal\site_ingestor\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

class SiteIngestorIngestForm_2 extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'site_ingestor_ingest_form_2';
  }

  public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $form['step'] = ['#markup' => '<h2>Step  2</h2>'];

    $path = drupal_get_path('module', 'site_ingestor');
    require_once $path . '/Classes/SiteIngestor/SiteIngestor.php';
    $SI = unserialize($_SESSION['SI']['step1']);
    $destination = $SI->dest;
    if (file_exists($destination) && file_exists($destination . '/' . $SI->systemName . '.info')) {
      $form['ingestion-settings'] = [
        '#type' => 'fieldset',
        '#title' => 'Ingestion Settings',
        '#description' => 'A theme with the name <em>' . $SI->humanName . '</em> already exists. Please choose an option below to proceed, or press your browser\'s back button to enter a new theme name:',
      ];

      $form['ingestion-settings']['overwrite'] = [
        '#type' => 'radios',
        '#title' => 'Overwrite settings',
        '#default_value' => 'overwrite_all',
        '#options' => [
          'overwrite_all' => 'Overwrite all files including customizations',
          'overwrite_save_custom' => 'Overwrite but retain customizations',
        ],
      ];

      $form['ingestion-settings']['info'] = [
        '#markup' => '<em>Customizations include theme.info file, template.php, and overrides.css. Changes to any other files will not be saved.'
        ];
    }

    $fileList = $SI->getFileList();

    $form['file-exclusion'] = [
      '#type' => 'fieldset',
      '#title' => 'File Exclusions',
      '#description' => 'The following files are candidates to be referenced remotely, please un-check any which you wish to leave on the remote server.<br /><br />',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    ];

    // Loop through each of the JS files and provide checkboxes to exclude them.
    $i = 0;
    foreach ($fileList['js'] as $index => $jsFile) {
      // In our case, we only allow files which are accessible over HTTPS to
    // remain remote.
      if ($SI->checkURL(str_replace('http', 'https', $jsFile['clean']))) {
        $form['file-exclusion']['files'][$i] = [
          '#title' => $jsFile['clean'],
          '#type' => 'checkbox',
          '#default_value' => 1,
          '#storage' => $index,
        ];
      }
      $i++;
    }

    // If no files are eligible for remote hosting.
    if (!isset($form['file-exclusion']['files'])) {
      $form['file-exclusion']['#description'] = '';
      $form['file-exclusion']['files'] = [
        '#markup' => 'No files were found which can be excluded. This is likely because there were no files which were available over HTTPS.<br />'
        ];
    }

    $form['submit'] = [
      '#value' => 'Next',
      '#type' => 'submit',
    ];

    return $form;
  }

  public function validateForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $SI = unserialize($_SESSION['SI']['step1']);
    $exclusionList = [];

    if (isset($form['ingestion-settings']['overwrite'])) {
      switch ($form['ingestion-settings']['overwrite']['#value']) {
        case 'overwrite_save_custom':
          $_SESSION['SI']['settings']['saveCustomFiles'] = TRUE;
          break;

        case 'overwrite_all':
          if (!$SI->deleteDirectory($SI->dest)) {
            $form_state->setErrorByName('overwrite', 'Unable to delete old theme. Please check the folder permissions or use a different theme name.');
          }
          break;
      }
    }

    foreach ($form['file-exclusion']['files'] as $key => $val) {
      if (strpos($key, '#') !== 0) {
        if (!$val['#checked']) {
          $exclusionList[] = $val['#storage'];
        }
      }
    }

    if (count($exclusionList)) {
      $SI->excludeFiles($exclusionList, 'js');
      \Drupal::logger('site_ingestor')->info('The following URLs were excluded during ingestion of theme ' . $SI->humanName . ': ' . implode(', ', $exclusionList), []);
    }

    // We need to perform a few "cleaning" operations on the
    // ingested page, specifically to address issues with PHP/Drupal,
    // so I'm implementing this here rather than in the SiteIngestor class.
    $SI->page = site_ingestor_html_cleaner($SI->page);

    $result = $SI->downloadFiles('page.html');
    // Check for errors.
    if ($result === FALSE) {
      $form_state->setErrorByName('files', $result);
      \Drupal::logger('site_ingestor')->error('Ingestion of theme ' . $SI->humanName . ' failed with message:' . implode(', ', $result), []);
      return;
    }

    // If downloadFiles returns an array, it means there's a list of files which could not be downloaded.
    if (is_array($result)) {
      drupal_set_message('The following URLs could not be reached and were skipped:<br />' . implode('<br />', $result) . '<br />This could be due to bad references in CSS, or anywhere in the page.', 'warning');
      \Drupal::logger('site_ingestor')->error('The following URLs could not be downloaded during ingestion of theme ' . $SI->humanName . ': ' . implode(', ', $result), []);
    }
    // Store the SiteIngestor object.
    $_SESSION['SI']['step2'] = serialize($SI);

    drupal_set_message('Site files downloaded.');
  }

  public function submitForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $form_state->set(['redirect'], 'admin/site-ingestor/ingest/3');
  }

}
?>
