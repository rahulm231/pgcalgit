<?php

/**
 * @file
 * Contains \Drupal\push_to_git\Form\PushToGitConfigForm.
 */

namespace Drupal\push_to_git\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

class PushToGitConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'push_to_git_config_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['push_to_git.settings'];
  }

  public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $config = \Drupal::config('pushToGit.settings');
    $form['ptg_repo_path'] = [
      '#type' => 'textfield',
      '#title' => 'Local repository path',
      '#description' => 'The absolute path to the folder you want to manage (e.g. /var/www/htdocs)',
      '#default_value' => $config->get('ptg_repo_path'),
    ];
    $form['ptg_email'] = [
      '#type' => 'textfield',
      '#title' => 'Repository Maintainer',
      '#description' => 'The email address of the person responsible for creating pull requests.',
      '#default_value' => $config->get('ptg_email'),
    ];
    // LS-3 - starts //
    $form['ptg_prod_ip'] = [
      '#type' => 'textfield',
      '#title' => 'IP Address',
      '#description' => 'IP Address of Production Server (Old Production - 192.237.215.237, New Production - 162.209.69.4)',
      '#default_value' => $config->get('ptg_prod_ip'),
    ];

    $form['submit'] = [
      '#value' => 'Save',
      '#type' => 'submit',
    ];

  return $form;

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = \Drupal::service('config.factory')->getEditable('pushToGit.settings');

    $ptg_repo_path = $form_state->getValue('ptg_repo_path');
    $ptg_email = $form_state->getValue('ptg_email');
    $ptg_prod_ip = $form_state->getValue('ptg_prod_ip');

    // Set and save new siteapikey value.
    $config->set('ptg_repo_path', $ptg_repo_path)
    ->set('ptg_email', $ptg_email)
    ->set('ptg_prod_ip', $ptg_prod_ip)
    ->save();
    // Display status message to user.
    drupal_set_message(t('configuration has been saved.'));

  }  

}
