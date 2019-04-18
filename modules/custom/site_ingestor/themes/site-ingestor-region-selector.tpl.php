<script type="text/javascript" src="/misc/jquery.js?v=1.4.4"></script>
<?php
  print $templateFile;
?>
<script language="javascript" type="text/javascript" src="/<?php print $modulePath; ?>/js/DOMISO.js"></script>
<script language="javascript" type="text/javascript" src="/<?php print $modulePath; ?>/js/site_ingestor_region_selector.js"></script>
<link type="text/css" rel="stylesheet" href="/<?php print $modulePath; ?>/css/site_ingestor_region_selector.css" media="all" />
<?php
$regionButtons = '';
$hiddenInputs = '';
  foreach($regions as $region => $title) {
    $regionButtons .= '<li><button type="button" id="btn-'.$region.'" class="btn region">'.$title.'</button></li>';
    $hiddenInputs .= '<input type="hidden" name="form-region-'.$region.'" />';
  }
?>
<form id="site_ingestor_region_selector" action="/admin/site-ingestor/create-regions" method="post">
  <input type="hidden" name="form_id" value="site_ingestor_region_selector" />
  <input type="hidden" name="themePath" value="<?php print $themePath; ?>" />
  <input type="hidden" name="themeName" value="<?php print $themeName; ?>" />
  <?php print $hiddenInputs; ?>
  <ul id="region-selector">
    <li class="first">Define regions:</li>
    <?php print $regionButtons; ?>
    <li class="last save"><input type="submit" class="btn save" value="Save" /></li>
    <li class="last edit"><button type="button" id="btn-edit" class="btn edit">Edit HTML</button></li>
  </ul>
</form>
<form id="site_ingestor_html_editor" action="/admin/site-ingestor/edit-html" method="POST">
  <ul id="region-selector">
    <li class="last save"><input type="submit" class="btn save" value="Save" /></li>
    <li class="last cancel"><button type="button" id="btn-cancel" class="btn cancel">Cancel</button></li>
  </ul>
  <input type="hidden" name="form_id" value="site_ingestor_edit_html" />
  <input type="hidden" name="themePath" value="<?php print $themePath; ?>" />
  <input type="hidden" name="themeName" value="<?php print $themeName; ?>" />
  <textarea name="html" id="html"><?php print \Drupal\Component\Utility\Html::escape($templateFile); ?></textarea>
</form>
