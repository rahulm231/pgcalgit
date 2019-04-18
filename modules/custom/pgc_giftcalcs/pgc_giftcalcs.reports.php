<?php

/**
 * @file
 * Generate report pages based on information from the PG-CALC web services.
 */

/**
 * Page callback for reports/giftcalcs.
 *
 * @param string $type
 *   One of 'summary' or 'details'.
 * @param int $uid
 *   user ID; only admin is allowed to set this.
 */
function pgc_giftcalcs_reports($type, $uid = NULL) {
  global $user;
  if (!isset($uid)) {
    $uid = $user->uid;
  }
  elseif ($uid != $user->uid && !user_access('administer users')) {
    // Only administrators can view other users' reports.
    return MENU_ACCESS_DENIED;
  }

  if ($type != 'summary' && $type != 'details') {
    return MENU_NOT_FOUND;
  }

  $wsguid = pgc_giftcalcs_get_profile_value($uid, 'field_wsguid', 'org');
  if (!$wsguid) {
    return 'WS GUID not set.';
  }

  $session_id = pgc_giftcalcs_start_session($wsguid);
  if ($session_id === FALSE) {
    return 'Unable to establish session with web service.';
  }

  $query_params = drupal_get_query_parameters();
  // #GEP-2 -starts
  //drupal_add_js(array('query_string_params' => $query_params), 'setting');
  drupal_add_js(array('query_string_params' => $query_params,'report_type' => $type), 'setting');
  // #GEP-2 -ends
  $params = !empty($query_params['params']) ? $query_params['params'] : array();
  $params += pgc_giftcalcs_report_default_params();
  foreach (array('MinGiftAmount', 'MaxGiftAmount') as $key) {
    $params[$key] = (int) str_replace(',', '', $params[$key]);
  }

  // Generate a report for the summary page or if the Search button has been
  // used on the details page.
  // #GEP-2 - starts
  /*
  if ($type == 'summary') {
    $report = array(pgc_giftcalcs_get_report($session_id, $wsguid, 1, array()));
  }
  elseif ($query_params) {
    $report = pgc_giftcalcs_get_report($session_id, $wsguid, 2, $params);
  }
  else {
    $report = array();
  } */
  if ($query_params) {
    $report = pgc_giftcalcs_get_report($session_id, $wsguid, 2, $params);
  }
  else {
    $report = array();
  }
  // #GEP-2 - ends

  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/media/js/jquery.js');
  drupal_add_js('https://code.jquery.com/ui/1.10.3/jquery-ui.min.js', 'external');
  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/datatables/js/jquery.dataTables.js');
  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js');
  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/extensions/Buttons/js/dataTables.buttons.min.js');
  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/extensions/Buttons/js/buttons.print.min.js');
  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/extensions/Buttons/js/buttons.html5.min.js');
  drupal_add_js(drupal_get_path('module', 'pgc_giftcalcs') . '/js/report.custom.js');

  drupal_add_css('https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css', array('type' => 'external'));
  drupal_add_css(drupal_get_path('module', 'pgc_giftcalcs') . '/css/report.custom.css', array('weight' => '-1'));
  drupal_add_css(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/media/css/jquery.dataTables.min.css', array('weight' => '995'));
  drupal_add_css(drupal_get_path('module', 'pgc_giftcalcs') . '/datatables/extensions/Buttons/css/buttons.dataTables.min.css', array('weight' => '996'));

  $output = '';
  
  // #GEP-2 - starts
  /*
  if ($type == 'details') {
    $form = drupal_get_form('pgc_giftcalcs_reports_details_form');
    $output .= drupal_render($form);
  }
  
  if ($type == 'summary' || !empty($query_params)) {
    if (is_object($report) && isset($report->ErrorCode)) {
      $output .= '<p>' . check_plain($report->Status) . '</p>';
    }
    else {
      $variables = pgc_giftcalcs_process_report($report, $type);
      $output .= theme('table', $variables);
    }
  }
  */
  
  if ($type == 'details' || $type == 'summary') {
    $form = drupal_get_form('pgc_giftcalcs_reports_details_form');
    $output .= drupal_render($form);
  }
  
  if (!empty($query_params)) {
    if (is_object($report) && isset($report->ErrorCode)) {
      $output .= '<p>' . check_plain($report->Status) . '</p>';
    }
    else {
      $variables = pgc_giftcalcs_process_report($report, $type);
      $output .= theme('table', $variables);
    }
  }
  // #GEP-2 - ends

  return $output;
}

/**
 * Process report for use with theme_table().
 *
 * @param string $type
 *   One of 'summary' or 'details'.
 * @param array $report
 *   An array of objects as returned from the web services.
 *
 * @return array
 *   An array suitable for theme_table().
 */
function pgc_giftcalcs_process_report($report, $type) {
  $variables = array('sticky' => FALSE);
  $variables['attributes'] = array(
    'id' => $type,
    'cellspacing' => '0',
    'width' => '100%',
    'no_striping' => TRUE,
  );
  
  //if ($type == 'details') {
  if(!empty($report)){
    if ($type == 'details' || $type='summary') { // #GEP-2
      $variables['attributes']['class'] = array('display', 'pgc-report', 'fixedHeader');

      // #PGCS-536 - Starts 
    
      if(key($report)!==0){
		$report = array(0=>(object)$report);
	  }	
	
	  // #PGCS-536 - Ends

      // #GEP-2
	  if($type == 'details'){
	    foreach ($report as $k => $detail) {
          if (empty($detail->TermLength)) {
            $temp_row = new stdClass();
            foreach ($detail as $name => $value) {
              $temp_row->$name = $value;
              if ($name == 'Age2') {
                $temp_row->TermLength = '';
              }
            }
            $report[$k] = $temp_row;
          }
		  /* #GEP-13 - Starts */
		  $report[$k]->GiftTypeName = $detail->GiftLabel;
		  unset($report[$k]->GiftLabel);
		  /* #GEP-13 - Ends */
        }
	  }else{
	    $summary_report = array();
	    $i = 0;
	  
	    foreach ($report as $k => $detail) {
	  	  $summary_report[$i] = new stdClass();	  	
		  if(empty($summary_report)){
		    //$summary_report[$i]->GiftTypeName = $detail->GiftTypeName; // #GEP-13		    
			$summary_report[$i]->GiftTypeName = $detail->GiftLabel;
		    $summary_report[$i]->Gifts = 1;
		    $summary_report[$i]->GiftAmount = $detail->GiftAmount;
		    $summary_report[$i]->CostBasis = $detail->CostBasis;
		    $summary_report[$i]->AnnualPayment = $detail->AnnualPayment;
		    $summary_report[$i]->FirstYearIncome = $detail->FirstYearIncome;
		    $summary_report[$i]->TaxFreePortion = $detail->TaxFreePortion;
		    $summary_report[$i]->CharitableDeduction = $detail->CharitableDeduction;
		    $summary_report[$i]->BuildingValue = $detail->BuildingValue;
			$summary_report[$i]->GiftType = $detail->GiftTypeName; // #GEP-13 adding this to check if gifttype name already exist in the array.
		    $i++;
		  }else{
		    $gifttypeindex = giftTypeExist($summary_report, $detail->GiftLabel);
		    if ($gifttypeindex!==FALSE) {
		  	  $summary_report[$gifttypeindex]->Gifts+= 1;
		  	  $summary_report[$gifttypeindex]->GiftAmount+= $detail->GiftAmount;			
			  $summary_report[$gifttypeindex]->CostBasis+= $detail->CostBasis;
			  $summary_report[$gifttypeindex]->AnnualPayment+= $detail->AnnualPayment;
			  $summary_report[$gifttypeindex]->FirstYearIncome+= $detail->FirstYearIncome;
			  $summary_report[$gifttypeindex]->TaxFreePortion+= $detail->TaxFreePortion;
			  $summary_report[$gifttypeindex]->CharitableDeduction+= $detail->CharitableDeduction;
			  $summary_report[$gifttypeindex]->BuildingValue+= $detail->BuildingValue;
		    }else{
		       //$summary_report[$i]->GiftTypeName = $detail->GiftTypeName; // #GEP-13		      
			  $summary_report[$i]->GiftTypeName = $detail->GiftLabel;
		      $summary_report[$i]->Gifts = 1;
			  $summary_report[$i]->GiftAmount = $detail->GiftAmount;
		      $summary_report[$i]->CostBasis = $detail->CostBasis;
		      $summary_report[$i]->AnnualPayment = $detail->AnnualPayment;
		      $summary_report[$i]->FirstYearIncome = $detail->FirstYearIncome;
		      $summary_report[$i]->TaxFreePortion = $detail->TaxFreePortion;
		      $summary_report[$i]->CharitableDeduction = $detail->CharitableDeduction;
		      $summary_report[$i]->BuildingValue = $detail->BuildingValue;
			  $summary_report[$i]->GiftType = $detail->GiftTypeName; // #GEP-13
			  $i++;	
		    }
		  }
	    }	
	  
	    $report = $summary_report; 
	  }
	  // #GEP-2 - ends
    }

    /* #GEP-13 - Starts */
    $header = array_keys((array) current($report));
	if($type == 'details'){
	  $header[1] = 'GiftLabel';
	}else{
	  $header[0] = 'GiftLabel';	
	  unset($header[9]);
	}
	//$variables['header'] = array_keys((array) current($report));
	$variables['header'] = $header;
    /* #GEP-13 - Ends */
    
    $variables['rows'] = array();
    foreach ($report as $detail) {
      $row = array();
      foreach ($detail as $key => $value) {
        // Apply money formatting to money fields.
        if (in_array($key, array(
            'GiftAmount',
            'AnnualPayment',
            'BuildingValue',
            'CapitalGainPortion',
            'CharitableDeduction',
            'CostBasis',
            'FirstYearIncome',
            'TaxFreePortion',
          ))) {
          $value = '$' . number_format($value, 2);
        }
        elseif (in_array($key, array(
            'IRSDiscountRate',
            'PaymentRate',
          ))) {
          $value = number_format($value, 2) . '%';
        }
        elseif (in_array($key, array('Age1', 'Age2'))) {
          if ($value == '-1' || $value == '0') {
            $value = '';
          }
        }
		elseif (in_array($key, array('ContactDonor'))) {
          if ($value === 1) {
            $value = 'Yes';
          }elseif($value === 0){
          	$value = 'No';
          }else{
          	$value = $value;
          }
        }
		
		if($key!='GiftType'){ // #GEP-13
		  $row[] = $value;	
		} // #GEP-13
      }
      $variables['rows'][] = array('data' => $row, 'no_striping' => TRUE);
    }

  }
  return $variables;
}

/**
 * Default parameters to send to web services.
 *
 * The web serrvices return an error if any of these is undefined.
 * See PGCS-239.
 */
function pgc_giftcalcs_report_default_params() {
  $params = array(
    "MinGiftDate" => "",
    "MaxGiftDate" => "",
    "MinCalculationDate" => "",
    "MaxCalculationDate" => "",
    "MinGiftAmount" => "",
    "MaxGiftAmount" => "",
    "LastName" => "",
    "FirstName" => "",
    "GiftTypeList" => "",
  );

  return $params;
}

function pgc_giftcalcs_reports_details_form($form, &$form_state) {
  $values = drupal_get_query_parameters();
  $form['#method'] = 'get';
  $form['params']['#tree'] = TRUE;
  $form['params']['MinGiftDate'] = array(
    '#type' => 'textfield',
    '#title' => t('Gift dates:'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'gift-date-from',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['MinGiftDate']) ? $values['params']['MinGiftDate'] : '',
  );

  $form['params']['MaxGiftDate'] = array(
    '#type' => 'textfield',
    '#title' => t('to'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'gift-date-to',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['MaxGiftDate']) ? $values['params']['MaxGiftDate'] : '',
  );

  $form['params']['MinCalculationDate'] = array(
    '#type' => 'textfield',
    '#title' => t('Calculation dates:'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'calculation-dates-from',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['MinCalculationDate']) ? $values['params']['MinCalculationDate'] : '',
  );

  $form['params']['MaxCalculationDate'] = array(
    '#type' => 'textfield',
    '#title' => t('to'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'calculation-dates-to',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['MaxCalculationDate']) ? $values['params']['MaxCalculationDate'] : '',
  );

  $gift_type_values = array(
    'q' => 'bequest',
    'g' => 'gift annuity',
    'd' => 'deferred gift annuity',
    'a' => 'charitable remainder annuity trust',
    'u' => 'charitable remainder unitrust',
    'l' => 'charitable lead annuity trust',
    't' => 'charitable lead unitrust',
    'p' => 'pooled income fund',
    // #GEP-13 - starts here
    'p2' => 'pooled income fund #2',
    'p3' => 'pooled income fund #3',
    'p4' => 'pooled income fund #4',
    'p5' => 'pooled income fund #5',
    // #GEP-13 - ends here
    'r' => 'retained life estate',
  );

  $form['params']['GiftTypeList'] = array(
    '#type' => 'checkboxes',
    '#options' => $gift_type_values,
    '#title' => t('Gift types:'),
    '#default_value' => (!empty($values['params']['GiftTypeList']) && is_array($values['params']['GiftTypeList']) && count($values['params']['GiftTypeList'])) ? drupal_map_assoc(array_values($values['params']['GiftTypeList'])) : array(),
  );

  $form['params']['MinGiftAmount'] = array(
    '#type' => 'textfield',
    '#title' => t('Gift amounts:'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'gift-amounts-from',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['MinGiftAmount']) ? $values['params']['MinGiftAmount'] : '',
  );

  $form['params']['MaxGiftAmount'] = array(
    '#type' => 'textfield',
    '#title' => t('to'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'gift-amounts-to',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['MaxGiftAmount']) ? $values['params']['MaxGiftAmount'] : '',
  );

  if(arg(2)=='details'){ // #GEP-2 
  $form['params']['LastName'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name:'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'last-name',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['LastName']) ? $values['params']['LastName'] : '',
  );

  $form['params']['FirstName'] = array(
    '#type' => 'textfield',
    '#title' => t('First name:'),
    '#size' => 20,
    '#attributes' => array(
      'id' => 'first-name',
      'class' => array(),
    ),
    '#value' => !empty($values['params']['FirstName']) ? $values['params']['FirstName'] : '',
  );

  $form['number_entries'] = array(
    '#type' => 'select',
    '#title' => t('Show'),
    '#options' => array(
      '10' => '10',
      '25' => '25',
      '50' => '50',
      '100' => '100',
    ),
    '#default_value' => !empty($values['number_entries']) ? $values['number_entries'] : '',
    '#field_suffix' => 'entries',
  );
  } // #GEP-2

  $form['search'] = array(
   '#type' => 'submit',
   '#value' => t('Search'),
    '#attributes' => array(
      'id' => 'reports-details_search',
      'class' => array(),
    ),
  );

  return $form;
}


/**
 * Submit a report to the web services.
 *
 * @param string $session_id
 *   TODO
 * @param string $wsguid
 *   TODO
 * @param int $report_type
 *   1 for summary, 2 for details
 *
 * @return mixed
 *   Summary is an object; details is an array of objects.
 */
function pgc_giftcalcs_get_report($session_id, $wsguid, $report_type, $extra_params = array()) {
  $params = new stdClass();
  $params->WSGUID = $wsguid;
  $params->AdminSessionID = $session_id;
  $params->ReportType = $report_type;
  if (count($extra_params)) {
    foreach($extra_params as $k => $v) {
      if ($k == 'GiftTypeList') {
        if (is_array($v) && count($v)) {
          $v = implode(',', $v);
        }
      }
      $params->$k = $v;
    }
  }
  $url = pgc_appserver_webservice_urls('adminReports');

  $resp = drupal_http_request($url, array(
    'method' => 'POST',
    'data' => json_encode($params),
    'headers' => array('Content-Type' => 'text'),
    'timeout' => 120,
  )); 
  
  
  if ($resp->code == 200 && isset($resp->data)) {
  	$data = str_replace(array("\n", "\r"), "", $resp->data);
	$data = str_replace('"Phone":0000000000', '"Phone":"-"', $data); // PGCS-724
    if ($data = json_decode($data)) {
      return $data;
    }
  }// #GEP-2 - starts
  else{
  	$error = new stdClass();
	$error->ErrorCode = $resp->code;
	$error->Status = $resp->error;
	return $error;
  }
  // #GEP-2 - ends
  return FALSE;
}

/**
 * Open a session with the web services.
 *
 * @param string $wsguid
 *   TODO
 *
 * @return string
 *   an administrative session ID
 */
function pgc_giftcalcs_start_session($wsguid) {
  $params = new stdClass();
  $params->WSGUID = $wsguid;
  $url = pgc_appserver_webservice_urls('adminSessionID');

  $resp = drupal_http_request($url, array(
    'method' => 'POST',
    'data' => json_encode($params),
    'headers' => array('Content-Type' => 'text'),
  ));

  if ($resp->code == 200 && json_decode($resp->data)) {
    if ($data = json_decode($resp->data)) {
      if (isset($data->AdminSessionID)) {
        return $data->AdminSessionID;
      }
    }
  }

  return FALSE;
}

// #GEP-2
function giftTypeExist(array $myArray, $word) {
    foreach ($myArray as $k=>$element) {
        if (!empty($element->GiftTypeName) && $element->GiftTypeName == $word) {
            return $k;
        }
    }
    return false;
}
