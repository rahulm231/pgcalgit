<?php

/**
 * @file
 * Contains \Drupal\push_to_git\Form\PushToGitForm.
 */

namespace Drupal\push_to_git\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

class PushToGitForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'push_to_git_form';
  }

  public function buildForm(array $form, \Drupal\Core\Form\FormStateInterface $form_state) {
    $form['push'] = [
      '#type' => 'fieldset',
      '#title' => 'Changed & created files to be pushed',
    ];
    $repo_path = _push_to_git_repo_path();
    if (!$repo_path) {
      $form['push']['error'] = [
        '#markup' => t('Please correct the errors reported above.')
        ];
    }
    elseif (($diff_list = push_to_git_diff_list($repo_path)) === FALSE) {
      $form['push']['error'] = [
        '#markup' => t('An error occurred while checking the git repository. There is more information in the system log.')
        ];
    }
    elseif (count($diff_list)) {

      $form['push']['repo_path'] = [
        '#markup' => t('New, changed, and deleted files in %dir', [
          '%dir' => $repo_path
          ])
        ];
      // @FIXME
      // theme() has been renamed to _theme() and should NEVER be called directly.
      // Calling _theme() directly can alter the expected output and potentially
      // introduce security issues (see https://www.drupal.org/node/2195739). You
      // should use renderable arrays instead.
      // 
      // 
      // @see https://www.drupal.org/node/2195739
      // $form['push']['contents'] = array(
      //       '#markup' => theme('ptg_diff_list', array('files' => $diff_list)),
      //     );

      $form['push']['submit'] = [
        '#type' => 'submit',
        '#value' => 'Push to Git',
      ];
    }
    else {
      $form['push']['nothing'] = ['#markup' => 'No files have been changed.'];
      // Master site does not use a branch, so no pull requests.
      // @FIXME
      // // @FIXME
      // // This looks like another module's variable. You'll need to rewrite this call
      // // to ensure that it uses the correct configuration object.
      // $site_system_name = variable_get('site_system_name');

      if ($site_system_name != 'pgcalc_master') {
        $form['pullrequest'] = [
          '#type' => 'fieldset',
          '#title' => 'Push to Production',
        ];
        $form['pullrequest']['info'] = [
          '#markup' => '<p>When you are ready to move changes to production, clicking the button below will push your theme customizations to GitHub.</p>'
          ];
        // @FIXME
        // l() expects a Url object, created from a route name or external URI.
        // $args = array(
        //         '!DevtoProd' => \Drupal::l(t('Migrate Development DB to Production'), \Drupal\Core\Url::fromUri('http://jenkins.pgcalc.com:8080/job/Migrate%20Development%20DB%20to%20Production/')),
        //         '!BuildtoProd' => \Drupal::l(t('Build to Prod'), \Drupal\Core\Url::fromUri('http://jenkins.pgcalc.com:8080/job/Build%20to%20Prod/')),
        //         '%site_system_name' => $site_system_name,
        //         '%email' => variable_get('ptg_email', 'apalmer@pgcalc.com'),
        //         '!config' => l(t('configuration page'), 'admin/config/push-to-git'),
        //       );

        $form['pullrequest']['db'] = [
          '#markup' => '<p>' . t('If you have new or modified pages for this site, and want to push those to production as well, then use the !DevtoProd Jenkins task. The <strong>site_system_name</strong> is %site_system_name.', $args) . '</p>'
          ];
        $form['pullrequest']['config'] = [
          '#markup' => '<p>' . t('When you deploy to production, an e-mail will be sent to %email. If you want to update this, first visit the Push to Git !config.', $args) . '</p>'
          ];
        $form['pullrequest']['build'] = [
          '#markup' => '<p>' . t('After pushing your updates to GitHub, you can use the !BuildtoProd Jenkins task to push your updates to the production server. The <strong>site_system_name</strong> is %site_system_name.', $args) . '</p>'
          ];
        $form['pullrequest']['submit'] = [
          '#type' => 'submit',
          '#value' => 'Deploy to Production',
        ];
      }
    }
    return $form;
  }

  public function submitForm(array &$form, \Drupal\Core\Form\FormStateInterface $form_state) {
    // The pull request button is available only if all changes have
  // already been pushed to git.
    if (isset($form['pullrequest'])) {
      if ($form_state->getValue(['db'])) {
        $move_database = TRUE;
      }
      else {
        $move_database = FALSE;
      }
      $result = push_to_git_pull_request($move_database);
    }
    else {
      $result = push_to_git_push();
    }

    drupal_set_message($result[0], $result[1]);
  }

}
?>
