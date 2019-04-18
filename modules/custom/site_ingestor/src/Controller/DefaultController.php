<?php /**
 * @file
 * Contains \Drupal\site_ingestor\Controller\DefaultController.
 */

namespace Drupal\site_ingestor\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Default controller for the site_ingestor module.
 */
class DefaultController extends ControllerBase {

  public function site_ingestor_region_selector($themeName) {
    // Load the unaltered template.
    $themePath = \Drupal::root() . '/sites/all/themes/' . $themeName . '/page.html';
    $modulePath = drupal_get_path('module', 'site_ingestor');
    // Sometimes scripts in the page will call with a bad directory name
    // This shouldn't throw errors, wrap the next line in @ and catch "false".
    $templateFile = @file_get_contents($themePath);
    $templateFile = preg_replace('/[ \t]+/', ' ', preg_replace('/[\r\n]+/', "\n", $templateFile));

    // In an attempt to work around JS changing classes at runtime,
    // we save every element's original class to a dummy attribute.
    // The DOMSelection tool will use these classes when it builds the XPath
    // query, so that we can reliably target elements on the backend when we do
    // our replacements.
    preg_match_all('/class\s*=\s*("[^"]+"|\'[\']+\')/', $templateFile, $classes);
    $uniqueClasses = array_unique($classes[0]);
    foreach ($uniqueClasses as $class) {
      // In case we have already modified this file, remove the dummy classes we
    // added previously. Otherwise, these strings double in length with each
    // pass.
      $templateFile = str_replace(' original-' . $class, '', $templateFile);
      $templateFile = str_replace($class, $class . ' original-' . $class, $templateFile);
    }

    // If the original page has a base tag, then remove it.
    $templateFile = preg_replace('/<base .*?>\s*\n?/', '', $templateFile);

    // I've decided to hard code the regions here, there are too many specific
    // rules to parse them out of the .info file, and many of them are included
    // in the tpl file automatically now.
    $regions = [
      'main' => 'Content',
      'menu' => 'Menu',
      'misc' => 'Misc',
      // #MSE-5
    ];

    // Exclude the menu if the menu type is "Do not add"
    // @FIXME
    // // @FIXME
    // // This looks like another module's variable. You'll need to rewrite this call
    // // to ensure that it uses the correct configuration object.
    // $menu_style = variable_get('si__menu_style', 0);

    if ($menu_style == -1) {
      unset($regions['menu']);
    }

    // Theme output.
    // @FIXME
    // theme() has been renamed to _theme() and should NEVER be called directly.
    // Calling _theme() directly can alter the expected output and potentially
    // introduce security issues (see https://www.drupal.org/node/2195739). You
    // should use renderable arrays instead.
    // 
    // 
    // @see https://www.drupal.org/node/2195739
    // print theme('site_ingestor_region_selector', array(
    //     'templateFile' => $templateFile,
    //     'modulePath' => $modulePath,
    //     'themePath' => $themePath,
    //     'themeName' => $themeName,
    //     'regions' => $regions,
    //   ));


    // Quit before Drupal has a chance to output anything else.
    drupal_exit();
  }

  public function site_ingestor_create_regions() {
    if (!isset($_POST['form_id']) || $_POST['form_id'] != 'site_ingestor_region_selector') {
      drupal_set_message('An error occurred.', 'error');
      drupal_goto('admin/site-ingestor/ingest');
    }
    $themePath = $_POST['themePath'];
    $themeName = $_POST['themeName'];
    $page = file_get_contents($themePath);

    foreach ($_POST as $key => $val) {
      if (strpos($key, 'form-region-') !== FALSE) {
        $key = substr($key, 12);
        $decodedRegion = json_decode($val);
        if (count((array) $decodedRegion)) {
          $regions[$key] = $decodedRegion;
        }
      }
    }

    // There's a minor hack here, DOMDoc will kill attributes on the body
    // tag from time to time, so this function extracts those attributes
    // before opening the the page with DOMDoc. Later, when the page is
    // saved, they will be added back.
    $DOMHack = site_ingestor_domdoc_open_hack($page);
    $DOMDoc = $DOMHack['DOMDoc'];

    // If the original page has a base tag, then remove it.
    foreach ($DOMDoc->getElementsByTagName('base') as $element) {
      \Drupal::logger('site_ingestor')->notice('Removing base tag %html from the page', [
        '%html' => $DOMDoc->saveHTML($element)
        ]);
      $element->parentNode->removeChild($element);
    }

    $bodyAttributeString = $DOMHack['bodyAttributeString'];
    $xpath = new DOMXPath($DOMDoc);

    foreach ($regions as $region => $value) {
      // For the main region, we include a separate template file which contains
    // more regions.
      if ($region == 'main') {
        // If we're on the main region, with a left menu, but the sidebar region
      // wasn't selected, use a separate page template which also includes the
      // sidebar.
      // @FIXME
// // @FIXME
// // This looks like another module's variable. You'll need to rewrite this call
// // to ensure that it uses the correct configuration object.
// $menu_style = variable_get('si__menu_style', 0);

        if ($menu_style == 0 && !isset($regions['menu'])) {
          // Using '{{?php' '?}}' placeholders for PHP tags to prevent bugging
        // DOMDoc when the page is re-saved.
          $region_insert = '{{?php require(\Drupal::root()."/sites/all/themes/pgcalc_master/page-sidebar.content.tpl.php"); ?}}';
        }
        elseif ($menu_style == 1 && !isset($regions['menu'])) {
          // Using '{{?php' '?}}' placeholders for PHP tags to prevent bugging
        // DOMDoc when the page is re-saved.
          $region_insert = '{{?php require(\Drupal::root()."/sites/all/themes/pgcalc_master/page-menutop.content.tpl.php"); ?}}';
        }
        else {
          $region_insert = '{{?php require(\Drupal::root()."/sites/all/themes/pgcalc_master/page.content.tpl.php"); ?}}';
        }
      }
      else {
        $region_insert = '{{?php print render($page[\'' . $region . '\']); ?}}';
      }

      if ($value->innerHTML != 'undefined') {
        // #MSE-16 - Added this condition
        $success = FALSE;
        // Try to use the xpath query to find the node.
        $query = $xpath->query($value->xpath);
        // If no result, try the query again, excluding elements commonly added by
        // the browser.
        if (!$query->length) {
          $query = $xpath->query(str_replace('/tbody[1]', '', $value->xpath));
        }
        // If the query finds a result, use XPath to replace the node value.
        if ($query->length) {
          $query->item(0)->nodeValue = $region_insert;
          $success = TRUE;
        }
        else {
          // If XPath did not find the node, try replacing the JS provided node
        // value in the file This is buggy because it does not handle
        // whitespace/tabs well, could probably be improved, but it is a fallback
        // so its fine for now.
          if (!empty($value)) {
            if (strpos($page, $value->innerHTML)) {
              $page = str_replace($value->innerHTML, $region_insert, $page);
              $success = TRUE;
            }
          }
        }
        if (!$success) {
          \Drupal::logger('site-ingestor')->error('Failed to place region "' . $region . '" in file: ' . $themePath, []);
        }
      }
    }

    // Add the title variable to the page title.
    $query = $xpath->query('//title');
    if ($query->length) {
      $query->item(0)->nodeValue = '{{?php print $head_title; ?}}';
    }

    // Remove all of the DOMDoc hacks and save it back to HTML.
    $page = site_ingestor_domdoc_save_hack($DOMDoc, $bodyAttributeString);

    // Break the page into sections for the appropriate templates.
    $head_close_pos = strpos($page, '</head>');
    $body_close_pos = strpos($page, '</body>') + 7;
    $page_top = substr($page, 0, $head_close_pos);
    $page_mid = substr($page, $head_close_pos + 7, $body_close_pos - $head_close_pos - 7);
    $page_bottom = substr($page, $body_close_pos);

    // Save the HTML template with the page's top & bottom sections.
    $html_tpl = file_get_contents(drupal_get_path('module', 'site_ingestor') . '/templates/html.tpl.php');
    $html_tpl = str_replace('{{pagetop}}', $page_top, $html_tpl);
    $html_tpl = str_replace('{{pagebottom}}', $page_bottom, $html_tpl);
    file_put_contents(\Drupal::root() . '/sites/all/themes/' . $themeName . '/html.tpl.php', $html_tpl);

    // Save the page template with the page's body section.
    file_put_contents(str_replace('.html', '.tpl.php', $themePath), $page_mid);

    // Clear cache to flush theme cache.
    drupal_flush_all_caches();

    // Enable this theme.
    // @FIXME
    // db_update('system')
    //     ->fields(array(
    //       'status' => 1,
    //     ))
    //     ->condition('type', 'theme', '=')
    //     ->condition('name', $themeName, '=')
    //     ->execute();


    // Set this theme as the default.
    // @FIXME
    // // @FIXME
    // // This looks like another module's variable. You'll need to rewrite this call
    // // to ensure that it uses the correct configuration object.
    // variable_set('theme_default', $themeName);


    // Clear cache.
    drupal_flush_all_caches();

    // Move the default blocks into the appropriate regions.
    site_ingestor_set_block_regions($themeName);

    // Clear cache.
    drupal_flush_all_caches();

    // Proceed to the style builder tool.
    drupal_goto('admin/site-ingestor/style-builder/' . $themeName);
  }

  public function site_ingestor_style_builder($themeName, $mode = 'create') {
    $themePath = \Drupal::root() . '/sites/all/themes/' . $themeName;
    $modulePath = drupal_get_path('module', 'site_ingestor');
    // @FIXME
    // theme() has been renamed to _theme() and should NEVER be called directly.
    // Calling _theme() directly can alter the expected output and potentially
    // introduce security issues (see https://www.drupal.org/node/2195739). You
    // should use renderable arrays instead.
    // 
    // 
    // @see https://www.drupal.org/node/2195739
    // $output = theme('site_ingestor_style_builder', array('themePath' => $themePath, 'modulePath' => $modulePath, 'customizableStyles' => site_ingestor_get_customizable_styles(), 'mode' => $mode));

    print $output;
    drupal_exit();
  }

  public function site_ingestor_create_styles() {
    if (!isset($_POST['form_id']) || $_POST['form_id'] != 'site_ingestor_style_builder') {
      drupal_set_message('An error occurred.', 'error');
      drupal_goto('admin/site-ingestor/ingest');
    }

    // Save/remove extra items from POST contents.
    $theme = $_POST['theme'];
    unset($_POST['form_id']);
    unset($_POST['theme']);

    $css = '';
    $aggregatedStyles = [];

    foreach ($_POST as $field => $value) {
      // Remove the URL encoding I used to protect the POST unfriendly characters.
      $field = urldecode($field);
      $exploded = explode('|', $field);
      $selector = str_replace('+', ' ', $exploded[0]);
      $selector = str_replace('^', '.', $selector);
      $selector = str_replace('!', '#', $selector);
      $attr = $exploded[1];

      // Handle the freeform fields first.
      if ($attr == 'freeform' && $value != '') {
        // Add double spaces for formatting after newlines.
        $value = str_replace("\n", "\n  ", $value);
        $css .= $selector . " {\r\n" . "  " . $value . "\r\n}\r\n\r\n";
      }
      else {
        // For the individual attributes, aggregate them all into
      // an array, which we'll later loop over to build out
      // a consolidated style set.
        if ($value != '') {
          // Take off any semicolons incase they were pasted in.
          $value = str_replace(';', '', $value);
          $aggregatedStyles[$selector][$attr] = $value;
        }
      }
    }

    // Build the style sets.
    foreach ($aggregatedStyles as $selector => $attributes) {
      $css .= $selector . " {\r\n";
      foreach ($attributes as $attribute => $value) {
        $css .= "  " . $attribute . ": " . $value . ";\r\n";
      }
      $css .= "}\r\n\r\n";
    }

    // Write out CSS file.
    file_put_contents($theme . "/overrides.css", $css);

    // Clear cache to flush theme cache.
    drupal_flush_all_caches();

    // Additional configuration.
    $links = [];
    $links[] = [
      'href' => 'admin/structure/block/manage/pgc_contact_block/pgc_contact_block/configure',
      'title' => 'Contact block configuration',
      'target' => '_blank',
    ];
    $links[] = [
      'href' => 'admin/structure/token-custom',
      'title' => 'Variable Configuration',
      'target' => '_blank',
    ];

    // Clear the site ingestor session object.
    unset($_SESSION['SI']);
    // @FIXME
    // theme() has been renamed to _theme() and should NEVER be called directly.
    // Calling _theme() directly can alter the expected output and potentially
    // introduce security issues (see https://www.drupal.org/node/2195739). You
    // should use renderable arrays instead.
    // 
    // 
    // @see https://www.drupal.org/node/2195739
    // return 'Theme successfully ingested. Use the links below to finish customizing this site:<br /><br />' . theme('links', array('links' => $links));

  }

  public function site_ingestor_edit_html() {
    if (!isset($_POST['form_id']) || $_POST['form_id'] != 'site_ingestor_edit_html') {
      drupal_set_message('An error occurred.', 'error');
      drupal_goto('admin/site-ingestor/ingest');
    }
    $themePath = $_POST['themePath'];
    $themeName = $_POST['themeName'];
    $html = $_POST['html'];

    $result = file_put_contents($themePath, $html);
    if (!$result) {
      //die('test');
    }
    drupal_goto('admin/site-ingestor/region-selector/' . $themeName);
  }

}
