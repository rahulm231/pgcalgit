<?php

/**
 * @file
 * Contains \Drupal\site_ingestor\Form\SiteIngestorIngestForm_3.
 */

namespace Drupal\site_ingestor\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

class SiteIngestorIngestForm_3 extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'site_ingestor_ingest_form_3';
  }

  public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $form['step'] = ['#markup' => '<h2>Step  3</h2>'];

    $form['config'] = [
      '#type' => 'fieldset',
      '#title' => 'Site configuration',
      '#collapsed' => FALSE,
      '#collapsible' => FALSE,
      '#tree' => TRUE,
    ];

    $form['config']['menu_style'] = [
      '#type' => 'select',
      '#title' => 'Menu Type',
      '#options' => [
        0 => 'Left',
        1 => 'Top',
        -1 => 'Do not add menu',
      ],
      '#required' => TRUE,
    ];

    $form['gifttypes'] = [
      '#type' => 'fieldset',
      '#title' => 'Gift Types',
      '#collapsed' => FALSE,
      '#collapsible' => FALSE,
      '#tree' => TRUE,
    ];

    $query = db_query("SELECT title, nid FROM node WHERE type='gift_type' ORDER BY title");
    $gift_types = [];
    foreach ($query as $gift_type) {
      $gift_types[$gift_type->nid] = $gift_type->title;
    }
    $form['gifttypes']['selections'] = [
      '#type' => 'checkboxes',
      '#title' => 'Gift Types',
      '#options' => $gift_types,
      '#default_value' => array_keys($gift_types),
    ];

    $form['submit'] = [
      '#value' => 'Next',
      '#type' => 'submit',
    ];

    return $form;
  }

  public function validateForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $SI = unserialize($_SESSION['SI']['step2']);

    if (empty($_SESSION['SI']['settings']['saveCustomFiles'])) {
      if (($resp = site_ingestor_generate_theme($SI)) !== TRUE) {
        $form_state->setErrorByName('build-theme', $resp);
      }
      else {
        drupal_set_message('Theme files successfully generated.');
      }
    }
    $_SESSION['SI']['step3'] = serialize($SI);
    $form_state->setStorage($SI->systemName);
  }

  public function submitForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    // Save site configuration variables.
    foreach ($form_state->getValue(['config']) as $key => $val) {
      // @FIXME
// // @FIXME
// // The correct configuration object could not be determined. You'll need to
// // rewrite this call manually.
// variable_set('si__' . $key, $val);

    }

    // Unpublish any gift types which were not selected.
    foreach ($form_state->getValue(['gifttypes', 'selections']) as $key => $val) {
      $node = \Drupal::entityManager()->getStorage('node')->load($key);
      if ($val == 0) {
        $node->status = 0;
      }
      else {
        $node->status = 1;
      }
      $node->save();
    }
    $form_state->set(['redirect'], 'admin/site-ingestor/region-selector/' . $form_state->getStorage());
  }

}
?>
