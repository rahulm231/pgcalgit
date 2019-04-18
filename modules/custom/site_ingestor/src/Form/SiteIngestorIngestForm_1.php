<?php

/**
 * @file
 * Contains \Drupal\site_ingestor\Form\SiteIngestorIngestForm_1.
 */

namespace Drupal\site_ingestor\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;
use Drupal\site_ingestor\Controller\SiteIngestor;

class SiteIngestorIngestForm_1 extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'site_ingestor_ingest_form_1';
  }

  public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $_SESSION['SI']['settings'] = [];

    $form['step'] = ['#markup' => '<h2>Step  1</h2>'];

    $form['ingestion-options'] = [
      '#type' => 'fieldset',
      '#title' => 'Ingestion Options',
    ];

    $form['ingestion-options']['theme-name'] = [
      '#title' => 'Theme Name',
      '#description' => 'The name of the theme which will be generated. <strong>This should be a short, simple version of the site name.</strong>',
      '#type' => 'textfield',
      '#required' => TRUE,
      '#maxlength' => 200,
      '#size' => 100,
    ];

    $form['ingestion-options']['url'] = [
      '#title' => 'URL',
      '#description' => 'The URL of the site to be ingested.',
      '#type' => 'textfield',
      '#required' => TRUE,
      '#maxlength' => 200,
      '#size' => 100,
    ];

    $form['ingestion-options']['submit'] = [
      '#value' => 'Begin ingestion',
      '#type' => 'submit',
    ];

    return $form;
  }

  public function validateForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $theme_name = $form['ingestion-options']['theme-name']['#value'];
    $theme_system_name = strtolower($theme_name);
    $theme_system_name = preg_replace('@[^a-z0-9_]+@', '_', $theme_system_name);
    //print_r($form['ingestion-options']['url']['#value']);die;
    $SI = new SiteIngestor($form['ingestion-options']['url']['#value'], \Drupal::root() . '/themes/' . $theme_system_name, $theme_system_name, $theme_name, \Drupal::root());
    if ($SI->init()) {
      if ($SI->buildFileList()) {
        $_SESSION['SI']['step1'] = serialize($SI);
      }
      else {
        $form_state->setErrorByName('ingestion-options', 'Unable to build file list.');
      }
    }
    else {
      $form_state->setErrorByName('url', 'Unable to connect to site.');
    }
  }

  public function submitForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $form_state->set(['redirect'], 'admin/site-ingestor/ingest/2');
  }

}
