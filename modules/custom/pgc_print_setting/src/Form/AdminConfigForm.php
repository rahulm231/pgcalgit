<?php

 namespace Drupal\pgc_print_setting\Form;

 use Drupal\Core\Form\ConfigFormBase;
 use Drupal\Core\Form\FormStateInterface;

 class AdminConfigForm extends ConfigFormBase {
    const SETTINGS = 'pgc_print_setting.settings';
    protected function getEditableConfigNames() {
         return [
             'pgc_print_setting.adminconfig',
         ];
     }

    public function getFormId() {
        return 'pgc_print_setting_form';
    } 

    public function buildForm(array $form, FormStateInterface $form_state) {
        $config = $this->config(static::SETTINGS);

        $form['pgc_print'] =[
            '#type' => 'fieldset',
            '#title' => $this->t('Print preview settings'),
            '#description' => $this->t('Welcome message display to users when they login'),
            '#default_value' => $config->get('pgc_print')
          ];

          $form['pgc_print']['pgc_print_logo'] = array(
            '#title' => t('Print logo'), 
            '#type' => 'managed_file', 
            '#description' => t('The uploaded icon will be displayed on Brochure Pages and Print Preview.'), 
            '#upload_location' => 'public://pgc_print_logo/', 
            '#default_value' => \Drupal::config('pgc_print_setting.adminconfig')->get('logo') 
          );

          $form['pgc_print']['pgc_print_border'] = array(
            '#type' => 'jquery_colorpicker', 
            '#title' => t('Border color'), 
            '#default_value' => \Drupal::config('pgc_print_setting.adminconfig')->get('border'),
          );

          $form['submit'] = array(
            '#type' => 'submit',
            '#value' => t('Submit')
          );
        return $form;
    }

    public function submitForm(array &$form, FormStateInterface $form_state) {
      $data = array(
        'logo' => $form_state->getValue('pgc_print_logo'),
        'border' => $form_state->getValue('pgc_print_border')
      );
      \Drupal::configFactory()->getEditable('pgc_print_setting.adminconfig')
      ->set('logo', $form_state->getValue('pgc_print_logo'))
      ->set('border',$form_state->getValue('pgc_print_border'))
      ->save();
    }
 }