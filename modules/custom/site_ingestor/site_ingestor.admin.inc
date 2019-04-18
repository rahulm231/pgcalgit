<?php

/**
 * @file
 * Page callbacks for admin/site-ingestor/*.
 */
$siteingestor_path = drupal_get_path('module', 'site_ingestor');
require_once $siteingestor_path . '/Classes/SiteIngestor/SiteIngestor.php';

// These forms are just numbered sequentially to deal with the possibility
// of steps changing order, purpose, etc.
/**
 * Form
 * Step 1: Enter ingestion site URL & theme name.
 *
 * @param $form
 * @param $form_state
 */
function site_ingestor_ingest_form_1($form, &$form_state) {
  $_SESSION['SI']['settings'] = array();

  $form['step'] = array(
    '#markup' => '<h2>Step  1</h2>',
  );

  $form['ingestion-options'] = array(
    '#type' => 'fieldset',
    '#title' => 'Ingestion Options',
  );

  $form['ingestion-options']['theme-name'] = array(
    '#title' => 'Theme Name',
    '#description' => 'The name of the theme which will be generated. <strong>This should be a short, simple version of the site name.</strong>',
    '#type' => 'textfield',
    '#required' => TRUE,
    '#maxlength' => 200,
    '#size' => 100,
  );

  $form['ingestion-options']['url'] = array(
    '#title' => 'URL',
    '#description' => 'The URL of the site to be ingested.',
    '#type' => 'textfield',
    '#required' => TRUE,
    '#maxlength' => 200,
    '#size' => 100,
  );

  $form['ingestion-options']['submit'] = array(
    '#value' => 'Begin ingestion',
    '#type' => 'submit',
  );

  return $form;
}

/**
 * Form
 * Step 2: Allow input for file exclusions, trigger file download,
 * if theme already exists, prompt for overwrite options.
 *
 * @param $form
 * @param $form_state
 */
function site_ingestor_ingest_form_2($form, &$form_state) {
  $form['step'] = array(
    '#markup' => '<h2>Step  2</h2>',
  );

  $path = drupal_get_path('module', 'site_ingestor');
  require_once $path . '/Classes/SiteIngestor/SiteIngestor.php';
  $SI = unserialize($_SESSION['SI']['step1']);
  $destination = $SI->dest;
  if (file_exists($destination) && file_exists($destination . '/' . $SI->systemName . '.info')) {
    $form['ingestion-settings'] = array(
      '#type' => 'fieldset',
      '#title' => 'Ingestion Settings',
      '#description' => 'A theme with the name <em>' . $SI->humanName . '</em> already exists. Please choose an option below to proceed, or press your browser\'s back button to enter a new theme name:',
    );

    $form['ingestion-settings']['overwrite'] = array(
      '#type' => 'radios',
      '#title' => 'Overwrite settings',
      '#default_value' => 'overwrite_all',
      '#options' => array(
        'overwrite_all' => 'Overwrite all files including customizations',
        'overwrite_save_custom' => 'Overwrite but retain customizations',
      ),
    );

    $form['ingestion-settings']['info'] = array(
      '#markup' => '<em>Customizations include theme.info file, template.php, and overrides.css. Changes to any other files will not be saved.',
    );
  }

  $fileList = $SI->getFileList();

  $form['file-exclusion'] = array(
    '#type' => 'fieldset',
    '#title' => 'File Exclusions',
    '#description' => 'The following files are candidates to be referenced remotely, please un-check any which you wish to leave on the remote server.<br /><br />',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );

  // Loop through each of the JS files and provide checkboxes to exclude them.
  $i = 0;
  foreach ($fileList['js'] as $index => $jsFile) {
    // In our case, we only allow files which are accessible over HTTPS to
    // remain remote.
    if ($SI->checkURL(str_replace('http', 'https', $jsFile['clean']))) {
      $form['file-exclusion']['files'][$i] = array(
        '#title' => $jsFile['clean'],
        '#type' => 'checkbox',
        '#default_value' => 1,
        '#storage' => $index,
      );
    }
    $i++;
  }

  // If no files are eligible for remote hosting.
  if (!isset($form['file-exclusion']['files'])) {
    $form['file-exclusion']['#description'] = '';
    $form['file-exclusion']['files'] = array(
      '#markup' => 'No files were found which can be excluded. This is likely because there were no files which were available over HTTPS.<br />',
    );
  }

  $form['submit'] = array(
    '#value' => 'Next',
    '#type' => 'submit',
  );

  return $form;
}

/**
 * Form
 * Step 3: Site Options.
 *
 * @param $form
 * @param $form_state
 */
function site_ingestor_ingest_form_3($form, &$form_state) {
  $form['step'] = array(
    '#markup' => '<h2>Step  3</h2>',
  );

  $form['config'] = array(
    '#type' => 'fieldset',
    '#title' => 'Site configuration',
    '#collapsed' => FALSE,
    '#collapsible' => FALSE,
    '#tree' => TRUE,
  );

  $form['config']['menu_style'] = array(
    '#type' => 'select',
    '#title' => 'Menu Type',
    '#options' => array(0 => 'Left', 1 => 'Top', -1 => 'Do not add menu'),
    '#required' => TRUE,
  );

  $form['gifttypes'] = array(
    '#type' => 'fieldset',
    '#title' => 'Gift Types',
    '#collapsed' => FALSE,
    '#collapsible' => FALSE,
    '#tree' => TRUE,
  );

  $query = db_query("SELECT title, nid FROM node WHERE type='gift_type' ORDER BY title");
  $gift_types = array();
  foreach ($query as $gift_type) {
    $gift_types[$gift_type->nid] = $gift_type->title;
  }
  $form['gifttypes']['selections'] = array(
    '#type' => 'checkboxes',
    '#title' => 'Gift Types',
    '#options' => $gift_types,
    '#default_value' => array_keys($gift_types),
  );

  $form['submit'] = array(
    '#value' => 'Next',
    '#type' => 'submit',
  );

  return $form;
}

/**
 * Validate
 * Step 1: Create SiteIngestor instance, build file list.
 *
 * @param $form
 * @param $form_state
 */
function site_ingestor_ingest_form_1_validate($form, &$form_state) {
  $theme_name = $form['ingestion-options']['theme-name']['#value'];
  $theme_system_name = strtolower($theme_name);
  $theme_system_name = preg_replace('@[^a-z0-9_]+@', '_', $theme_system_name);

  $SI = new SiteIngestor($form['ingestion-options']['url']['#value'], \Drupal::root() . '/sites/all/themes/' . $theme_system_name, $theme_system_name, $theme_name, \Drupal::root());
  if ($SI->init()) {
    if ($SI->buildFileList()) {
      $_SESSION['SI']['step1'] = serialize($SI);
    }
    else {
      form_set_error('ingestion-options', 'Unable to build file list.');
    }
  }
  else {
    form_set_error('url', 'Unable to connect to site.');
  }
}

/**
 * Validate
 * Step 2: Download site files, skip exclusion list.
 *
 * @param $form
 * @param $form_state
 */
function site_ingestor_ingest_form_2_validate($form, &$form_state) {
  $SI = unserialize($_SESSION['SI']['step1']);
  $exclusionList = array();

  if (isset($form['ingestion-settings']['overwrite'])) {
    switch ($form['ingestion-settings']['overwrite']['#value']) {
      case 'overwrite_save_custom':
        $_SESSION['SI']['settings']['saveCustomFiles'] = TRUE;
        break;

      case 'overwrite_all':
        if (!$SI->deleteDirectory($SI->dest)) {
          form_set_error('overwrite', 'Unable to delete old theme. Please check the folder permissions or use a different theme name.');
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
    form_set_error('files', $result);
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

/**
 * Validation
 * Step 3: Site configuration.
 *
 * @param $form
 * @param $form_state
 */
function site_ingestor_ingest_form_3_validate($form, &$form_state) {
  $SI = unserialize($_SESSION['SI']['step2']);

  if (empty($_SESSION['SI']['settings']['saveCustomFiles'])) {
    if (($resp = site_ingestor_generate_theme($SI)) !== TRUE) {
      form_set_error('build-theme', $resp);
    }
    else {
      drupal_set_message('Theme files successfully generated.');
    }
  }
  $_SESSION['SI']['step3'] = serialize($SI);
  $form_state['storage']['theme-name'] = $SI->systemName;
}

/**
 * Submit callback for Step 1.
 */
function site_ingestor_ingest_form_1_submit($form, &$form_state) {
  $form_state['redirect'] = 'admin/site-ingestor/ingest/2';
}

/**
 * Submit callback for Step 2.
 */
function site_ingestor_ingest_form_2_submit($form, &$form_state) {
  $form_state['redirect'] = 'admin/site-ingestor/ingest/3';
}

/**
 * Submit callback for Step 3.
 */
function site_ingestor_ingest_form_3_submit($form, &$form_state) {
  // Save site configuration variables.
  foreach ($form_state['values']['config'] as $key => $val) {
    // @FIXME
// // @FIXME
// // The correct configuration object could not be determined. You'll need to
// // rewrite this call manually.
// variable_set('si__' . $key, $val);

  }

  // Unpublish any gift types which were not selected.
  foreach ($form_state['values']['gifttypes']['selections'] as $key => $val) {
    $node = \Drupal::entityManager()->getStorage('node')->load($key);
    if ($val == 0) {
      $node->status = 0;
    }
    else {
      $node->status = 1;
    }
    $node->save();
  }
  $form_state['redirect'] = 'admin/site-ingestor/region-selector/' . $form_state['storage']['theme-name'];
}

/**
 * Region selector.
 *
 * Presents the user with a DOM Inspector region selection tool to define
 * content regions. This is a hacked page because we want to have complete
 * control over the output.
 */
function site_ingestor_region_selector($themeName) {
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
  $regions = array(
    'main' => 'Content',
    'menu' => 'Menu',
    'misc' => 'Misc' // #MSE-5
  );

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

/**
 * Process "Edit HTML" submission.
 */
function site_ingestor_edit_html() {
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

/**
 * Process region selector submission.
 */
function site_ingestor_create_regions() {
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
    \Drupal::logger('site_ingestor')->notice('Removing base tag %html from the page', array('%html' => $DOMDoc->saveHTML($element)));
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
      elseif ($menu_style == 1  && !isset($regions['menu'])) {
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

	if($value->innerHTML!='undefined'){ // #MSE-16 - Added this condition
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

/**
 * Moves all of the default blocks into the appropriate regions.
 *
 * @param $themeName
 */
function site_ingestor_set_block_regions($themeName) {
  // Main menu block.
  // @FIXME
// // @FIXME
// // This looks like another module's variable. You'll need to rewrite this call
// // to ensure that it uses the correct configuration object.
// $region = variable_get('si__menu_style', 0);

  switch ($region) {
    case 0:
      $menu_region = 'menu';
      $menu_title = 'Planned Giving';
      break;

    case 1:
      $menu_title = '<none>';
      $menu_region = 'menu';
      break;
  }
  // Do not include menu block if it was disabled.
  if ($region != -1) {
  	// #PGCS-1012 - Starts here   	 
	 $countmainmenu = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'main-menu' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName,))->fetchField();	
	if($countmainmenu > 0){
	   /* I am adding this because previous update query was changing title for default theme only while on configuration page title is fetched from first block object which may not be current default theme this will update title for each theme */ 
  	  db_query("UPDATE block SET title = :title WHERE delta = 'main-menu' ", array(':title' => $menu_title));
	  db_query("UPDATE block SET status = 1, weight = -100, region = :region, title = :title WHERE delta = 'main-menu' AND theme = :themeName", array(':themeName' => $themeName, ':region' => $menu_region, ':title' => $menu_title));
    }
	//db_query("UPDATE block SET status = 1, weight = -100, region = :region, title = :title WHERE delta = 'main-menu' AND theme = :themeName", array(':themeName' => $themeName, ':region' => $menu_region, ':title' => $menu_title));
	// #PGCS-1012 - Ends Here    
  }

  // We can also set the menu to expanded/collapsed here depending on the type.
  if ($region == 0) {
    db_query("UPDATE menu_links SET expanded = 0 WHERE menu_name = 'main-menu'");
  }
  elseif ($region == 1) {
    db_query("UPDATE menu_links SET expanded = 1 WHERE menu_name = 'main-menu'");
  }

  // Main content block into content body region.
  // #PGCS-1012 - Starts here   	 
  $countcontent_body = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'main' AND theme = :themeName AND region = 'content' AND status = 1 ", array(':themeName' => $themeName))->fetchField();	
  if($countcontent_body > 0){
    db_query("UPDATE block SET status = 1, weight = -100, region = 'content_body', title='<none>' WHERE delta = 'main' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = -100, region = 'content_body', title='<none>' WHERE delta = 'main' AND theme = :themeName", array(':themeName' => $themeName));
  // #PGCS-1012 - Ends Here      

  // Contact block into content inline blocks region.
  // #PGCS-1012 - Starts here   	 
  $countcontact_block = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'pgc_contact_block' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName))->fetchField();	
  if($countcontact_block > 0){
    db_query("UPDATE block SET status = 1, weight = 0, region = 'content_inline_blocks' WHERE delta = 'pgc_contact_block' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = 0, region = 'content_inline_blocks' WHERE delta = 'pgc_contact_block' AND theme = :themeName", array(':themeName' => $themeName));
  // #PGCS-1012 - Ends Here
  

  // Footer contact block into content footer region.
  // #PGCS-1012 - Starts here   	 
  $countcontactfooter_block = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'pgc_contact_footer_block' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName))->fetchField();	
  if($countcontactfooter_block > 0){
    db_query("UPDATE block SET status = 1, weight = 0, region = 'content_footer' WHERE delta = 'pgc_contact_footer_block' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = 0, region = 'content_footer' WHERE delta = 'pgc_contact_footer_block' AND theme = :themeName", array(':themeName' => $themeName));
  // #PGCS-1012 - Ends Here
  

  // Resources block into content inline blocks region.
  // #PGCS-1012 - Starts here   	 
  $countresource_block = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'pgc_resource_block' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName))->fetchField();	
  if($countresource_block > 0){
    db_query("UPDATE block SET status = 1, weight = 1, region = 'content_inline_blocks' WHERE delta = 'pgc_resource_block' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = 1, region = 'content_inline_blocks' WHERE delta = 'pgc_resource_block' AND theme = :themeName", array(':themeName' => $themeName));
  // #PGCS-1012 - Ends Here
  
  // Slideshow block into content top region.
  // #PGCS-1012 - Starts here   	 
  $countslideshow_block = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'pgc_slideshow_block' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName))->fetchField();	
  if($countslideshow_block > 0){
    db_query("UPDATE block SET status = 1, weight = 0, region = 'content_top' WHERE delta = 'pgc_slideshow_block' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = 0, region = 'content_top' WHERE delta = 'pgc_slideshow_block' AND theme = :themeName", array(':themeName' => $themeName));  
  // #PGCS-1012 - Ends Here
  
  
  // #MSE-24 - mobilenav bar block into content top region.
  // #PGCS-1012 - Starts here   	 
  $countmobilenav_block = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'mobilenav' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName))->fetchField();	
  if($countmobilenav_block > 0){
    db_query("UPDATE block SET status = 1, weight = 1, region = 'content_top' WHERE delta = 'mobilenav' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = 1, region = 'content_top' WHERE delta = 'mobilenav' AND theme = :themeName", array(':themeName' => $themeName));
  // #PGCS-1012 - Ends Here  
  

  // Titlebar block into titlebar blocks region.
  // #PGCS-1012 - Starts here   	 
  $counttitlebar_block = db_query("SELECT COUNT(bid) AS count FROM {block} WHERE delta = 'pgc_titlebar_block' AND theme = :themeName AND region = -1 AND status = 0 ", array(':themeName' => $themeName))->fetchField();	
  if($counttitlebar_block > 0){
    db_query("UPDATE block SET status = 1, weight = 1, region = 'titlebar_blocks' WHERE delta = 'pgc_titlebar_block' AND theme = :themeName", array(':themeName' => $themeName));
  }
  //db_query("UPDATE block SET status = 1, weight = 1, region = 'titlebar_blocks' WHERE delta = 'pgc_titlebar_block' AND theme = :themeName", array(':themeName' => $themeName));
  // #PGCS-1012 - Ends Here
  
}

/**
 * Style builder
 * This is another hacked page, preventing Drupal from outputting anything.
 */
function site_ingestor_style_builder($themeName, $mode = 'create') {
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

/**
 * Submit handler for style builder.
 */

function site_ingestor_create_styles() {
  if (!isset($_POST['form_id']) || $_POST['form_id'] != 'site_ingestor_style_builder') {
    drupal_set_message('An error occurred.', 'error');
    drupal_goto('admin/site-ingestor/ingest');
  }
 
  // Save/remove extra items from POST contents.
  $theme = $_POST['theme'];
  unset($_POST['form_id']);
  unset($_POST['theme']);

  $css = '';
  $aggregatedStyles = array();

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
  $links = array();
  $links[] = array(
    'href'  => 'admin/structure/block/manage/pgc_contact_block/pgc_contact_block/configure',
    'title' => 'Contact block configuration',
    'target' => '_blank',
  );
  $links[] = array(
    'href'  => 'admin/structure/token-custom',
    'title' => 'Variable Configuration',
    'target' => '_blank',
  );

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

/**
 * Documentation needed.
 */
function site_ingestor_domdoc_open_hack($page) {
  // DOMDoc will destroy attributes on the body tag if there are any divs in the
  // head. There's no elegant fix for this, so I'm using a different DOM class
  // to pull out the body class before running the page through DOMDoc.
  require_once 'Classes/SiteIngestor/simple_html_dom.php';
  $html = str_get_html($page);
  $bodyTag = $html->find('body');
  $bodyAttributes = $bodyTag[0]->getAllAttributes();
  $bodyAttributeString = '';
  foreach ($bodyAttributes as $attribute => $value) {
    $bodyAttributeString .= ' ' . $attribute . '="' . $value . '"';
  }

  $DOMDoc = new DOMDocument();
  libxml_use_internal_errors(TRUE);
  // Hack to force DOMDoc to use UTF-8.
  $DOMDoc->loadHTML('<?xml version="1.0" encoding="UTF-8"?>' . $page);

  return array('DOMDoc' => $DOMDoc, 'bodyAttributeString' => $bodyAttributeString);
}

/**
 * Documentation needed.
 */
function site_ingestor_domdoc_save_hack($DOMDoc, $bodyAttributeString) {
  // Save the DOMDoc back to text.
  $page = $DOMDoc->saveHTML();

  // Remove the DOMDoc UTF-8 hack.
  $page = str_replace('<?xml version="1.0" encoding="UTF-8"?>', '', $page);

  // If DOMDoc killed the body attributes, replace them.
  if (strlen($bodyAttributeString) && strpos($page, '<body>') !== FALSE) {
    $fixedBodyTag = '<body' . $bodyAttributeString . '>';
    $page = str_replace('<body>', $fixedBodyTag, $page);
  }

  // Convert PHP tag placeholders.
  $page = str_replace('{{?', '<?', $page);
  $page = str_replace('?}}', '?>', $page);
  return $page;
}

/**
 * Performs various "cleanup" tasks we need to make the saved HTML
 * compatible with Drupal/PHP.
 *
 * @param $html
 *
 * @return string
 */
function site_ingestor_html_cleaner($html) {
  // Removes the body wrapping form from ASP.NET WebForms.
  $html = site_ingestor_html_cleaner_aspnet($html);
  // Removes the <? xml tag which breaks PHP with short tags enabled.
  $html = site_ingestor_html_cleaner_xmltag($html);
  return $html;
}

/**
 * Removes the body wrapping form from ASP.NET WebForms.
 *
 * @param $html
 */
function site_ingestor_html_cleaner_aspnet($html) {
  if (strpos($html, 'aspNetHidden')) {
    require_once 'Classes/SiteIngestor/simple_html_dom.php';
    $html = str_get_html($html);
    // Try to find the aspNetHidden div, if found, find it's parent (this will
    // be the form), and grab it's inner text.
    $formInnerHTML = $html->find("div.aspNetHidden", 0)->parent()->innertext;
    if (strlen($formInnerHTML)) {
      // If found, find the parent of the form and replace it's inner text with
      // the form's inner text. This will remove the form tag.
      $html->find("div.aspNetHidden", 0)->parent()->parent()->innertext = $formInnerHTML;
      return $html->save();
    }
  }

  return $html;
}

/**
 * This might not be needed, leaving stub.
 *
 * @param string $html
 *
 * @return string
 */
function site_ingestor_html_cleaner_xmltag($html) {
  return $html;
}
