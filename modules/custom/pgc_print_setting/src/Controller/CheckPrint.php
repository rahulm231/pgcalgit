<?php
    namespace Drupal\pgc_print_setting\Controller;

    use Drupal\Core\Controller\ControllerBase;
    use Drupal\node\Entity\Node;
    use Drupal\file\Entity\File;

    class CheckPrint extends ControllerBase {
        public function hello ($nid) { //Print preview function
            global $base_url;
            $view_builder = \Drupal::entityTypeManager()->getViewBuilder('node');
            $storage = \Drupal::entityTypeManager()->getStorage('node');
            $node = $storage->load($nid);
            $build = $view_builder->view($node, 'full');
            $output = render($build);            


            $path = \Drupal::request()->getRequestUri();
            $logo = \Drupal::config('pgc_print_setting.adminconfig')->get('logo');
            $border = \Drupal::config('pgc_print_setting.adminconfig')->get('border');
            if(strpos($path, '/check')!==FALSE || strpos($path, '/print/page')!== FALSE || strpos($path,'/pgc-print') !== FALSE) {
              if($logo[0] !='') {
                $file_uri = File::load($logo[0])->getFileUri();
                $base_url = \Drupal::request()->getSchemeAndHttpHost();
                $file_url   = parse_url(file_create_url($file_uri));
                $logo  = $base_url.$file_url['path'];
              }else {
                $logo  = "/abc.jpg";
              }
              if($border == ''){
                $border = "2px solid black";
              } else {
                $border = "2px solid ".$border;
              }
            }
            return array(
                '#theme' => 'pgc_print_page',
                "#title" => $node->getTitle(),
                '#description' => 'Sample description',
                '#body' => $output,
                '#border' => $border,
                '#logo' => $logo
            );
        }
    }