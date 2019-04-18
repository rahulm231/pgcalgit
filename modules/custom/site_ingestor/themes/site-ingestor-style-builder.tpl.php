<html>
<head>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script type="text/javascript" src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<link type="text/css" rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" media="all" />
<script language="javascript" type="text/javascript" src="/<?php print $modulePath; ?>/js/site_ingestor_style_builder.js"></script>
<link type="text/css" rel="stylesheet" href="/<?php print $modulePath; ?>/css/site_ingestor_style_builder.css" media="all" />
</head>
<body>
<div id="style-builder">
<div class="move"><div class="left hidden"><- Snap Left</div><div class="right">Snap Right -></div></div>
<form id="site_ingestor_style_builder" action="/admin/site-ingestor/create-styles" method="post">
<table>
<input type="hidden" name="form_id" value="site_ingestor_style_builder" />
<input type="hidden" name="theme" value="<?php print $themePath; ?>" />
<?php
if($mode == 'edit') {
  $existing_styles = site_ingestor_get_existing_css($themePath);

}

foreach($customizableStyles as $section => $attrs) {
  print '<tr class="section">';
  print '<td class="label">'.$attrs['label'].'</td>';
  // If available, add a checkbox to enable default style rules
  // and load all of the defaults into an array.
  if($attrs['defaults_available']) {
    print '<td class="defaults"><label for="'.$section.'-defaults">Use defaults</label> <input type="checkbox" id="'.$section.'-defaults" data-section="'.$section.'" /></td>';
    if($section == 'menu') {
      // @FIXME
// // @FIXME
// // This looks like another module's variable. You'll need to rewrite this call
// // to ensure that it uses the correct configuration object.
// $menu_type = variable_get('si__menu_style', 0);

      $menu_type = $menu_type == 0 ? 'left' : 'top';
      $cssfile = 'menu-'.$menu_type;
    } else {
      $cssfile = $section;
    }
    $default_styles = site_ingestor_get_default_css($cssfile);
  }
  print '<tr>';
  foreach($attrs['elements'] as $selector => $sAttrs) {
    $elementName = $sAttrs['label'];
    foreach($sAttrs['styles'] as $style) {
      $uid = $selector.'|'.$style;
      // Replacing a couple of characters which will not make it through a POST
      $safe_name = str_replace(' ', '+', $uid);
      $safe_name = str_replace('.', '^', $safe_name);
	  $safe_name = str_replace('#', '!', $safe_name);
      if($style == 'freeform') {
        $label = $elementName;
        $description = isset($sAttrs['description']) ? $sAttrs['description'] : '';
        // For freeform fields with default values, we collapse all of the style properties into a
        // single string and store it in the data-default attribute
        $default_style = '';
        if(isset($default_styles[$selector])) {
          $num_styles = count($default_styles[$selector])-1;
          $i = 0;
          foreach($default_styles[$selector] as $property => $style) {
          	if($property!='' && $style!=''){ // #MSE-24 - Added this condition because a blank css rule was appearing
              $default_style .= $property . ': ' . $style . ";";
              if($i < $num_styles) {
                $default_style .= "\n";
                $i++;
              }
			}
          }
        }
        $existing_style = '';
        if(isset($existing_styles[$selector])) {
          $num_styles = count($existing_styles[$selector])-1;
          $i = 0;
          foreach($existing_styles[$selector] as $property => $style) {
            $existing_style .= $property . ': ' . $style . ";";
            if($i < $num_styles) {
              $existing_style .= "\n";
              $i++;
            }
          }
        }

        print '<tr class="style-freeform"><td class="labeltd" colspan="2"><label for="'.$safe_name.'">'.$label.'<div class="description">'.$description.'</div></label><textarea name="'.$safe_name.'" data-selector="'.$uid.'" data-section="'.$section.'" data-default="'.$default_style.'" width="100%">'.$existing_style.'</textarea></td></tr>';
      } else {
        $label = $elementName . ' ' . $style;
        // For single style fields, if we have a default value, store it directly in the data-default attribute
        $default_style = isset($default_styles[$selector][$style]) ? $default_styles[$selector][$style] : '';
        $existing_style = isset($existing_styles[$selector][$style]) ? $existing_styles[$selector][$style] : '';
        print '<tr class="style"><td class="labeltd"><label for="'.$safe_name.'">'.$label.': </label></td><td><input type="text" name="'.$safe_name.'" data-selector="'.$uid.'" size="8" data-section="'.$section.'" data-default="'.$default_style.'" value="'.$existing_style.'" /></td></tr>';
      }
    }
  }
}
?>
<tr><td colspan="2"><input type="submit" value="Save" class="btn save" /></td></tr>
</table>
</form>
</div>
<iframe id="preview" src="/how-you-can-give/giving-and-generating-income/charitable-gift-annuity?hidetoolbar=true" sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts"></iframe>
<script language="javascript">document.getElementById('preview').onload= function(){SI.styleBuilder.mode = '<?php print $mode; ?>'; SI.styleBuilder.init();};</script>
</body>
</html>