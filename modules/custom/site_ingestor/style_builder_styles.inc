<?php
/*
 * Defines all of the styles which can be customized with the
 * Style Builder.
 */
function site_ingestor_get_customizable_styles() {
  return array(
    'regions' => array(
      'label' => 'Regions',
      'defaults_available' => true,
      'elements' => array(
        '#pgc-wrap-main' => array(
          'label' => 'Page wrap',
          'styles' => array(
            'freeform',
          ),
        ),
        '#pgc-region-sidebar' => array(
          'label' => 'Sidebar region',
          'styles' => array(
            'freeform',
          ),
        ),
        '#pgc-region-main' => array(
          'label' => 'Main region',
          'styles' => array(
            'freeform',
          ),
        ),
      ),
    ),
    'titlebar' => array(
      'label' => 'Titlebar Buttons',
      'defaults_available' => false,
      'elements' => array(
        '.pg-page-btns #titlebar-links' => array(
          'label' => 'Button',
          'styles' => array(
            'float',
          ),
        ),
        '.pg-page-btns .pgc-title-btn' => array(
          'label' => 'Button',
          'styles' => array(
            'background-color',
          ),
        ),
        '.pg-page-btns .pgc-title-btn a' => array(
          'label' => 'Button icon',
          'styles' => array(
            'color',
            'font-size',
         ),
        ),
      ),
    ),
    'text' => array(
      'label' => 'Text',
      'defaults_available' => true,
      'elements' => array(
        '.pg-content-body' => array(
          'label' => 'Global base',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap h1' => array(
          'label' => 'H1',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap h2' => array(
          'label' => 'H2',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap h3' => array(
          'label' => 'H3',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap h4' => array(
          'label' => 'H4',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap a' => array(
          'label' => 'Link',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap a:hover' => array(
          'label' => 'Link (hovered)',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap a:visited' => array(
          'label' => 'Links (visited)',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap a:active' => array(
          'label' => 'Links (active)',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap p' => array(
          'label' => 'Paragraph',
          'styles' => array(
            'freeform',
          ),
        ),
        '.pg-wrap blockquote' => array(
          'label' => 'blockquote',
          'styles' => array(
            'freeform',
          ),
        ),
      ),
    ),
    'menu' => array(
      'label' => 'Menu',
      'defaults_available' => true,
      'elements' => array(
        '#block-system-main-menu' => array(
          'label' => '#block-system-main-menu',
          'description' => 'Menu outer container',
          'styles' => array(
            'freeform',
          )
        ),
        '#block-system-main-menu h2 a' => array(
          'label' => '#block-system-main-menu h2 a',
          'description' => 'Menu title (link)',
          'styles' => array(
            'freeform',
          )
        ),
        '#main-menu' => array(
          'label' => 'ul',
          'description' => 'Menu list container',
          'styles' => array(
            'freeform',
          )
        ),
        '#main-menu li' => array(
          'label' => 'ul li',
          'description' => 'Menu item container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li:hover' => array(
          'label' => 'ul li:hover',
          'description' => 'Hovered menu item container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li a' => array(
          'label' => 'ul li a',
          'description' => 'Menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li a:hover' => array(
          'label' => 'ul li a:hover',
          'description' => 'Hovered menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li:hover a' => array(
          'label' => 'ul li:hover a',
          'description' => 'Menu item link in hovered item container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.expanded a' => array(
          'label' => 'ul li.expanded a',
          'description' => 'Expanded top level menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.collapsed a' => array(
          'label' => 'ul li.expanded a',
          'description' => 'Collapsed top level menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li a.active' => array(
          'label' => 'ul li a.active',
          'description' => 'Active menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.active-trail' => array(
          'label' => 'ul li.active-trail',
          'description' => 'Active trail menu item container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.active-trail:hover' => array(
          'label' => 'ul li.active-trail:hover',
          'description' => 'Hovered active trail menu item container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.active-trail a' => array(
          'label' => 'ul li.active-trail a',
          'description' => 'Active trail menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.active-trail a:hover' => array(
          'label' => 'ul li.active-trail a:hover',
          'description' => 'Hovered active trail menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.active-trail:hover a' => array(
          'label' => 'ul li.active-trail:hover a',
          'description' => 'Menu item link in hovered active item container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.last a' => array(
          'label' => 'ul li.last a',
          'description' => 'Menu item link (last)',
          'styles' => array(
            'freeform',
          ),
        ),
        // 2nd level menu
        '#main-menu li:hover ul' => array(
          'label' => 'ul li:hover ul',
          'description' => 'Expanded 2nd level container (dropdown)',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul' => array(
          'label' => 'ul.menu ul',
          'description' => '2nd Level menu container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li' => array(
          'label' => 'ul.menu ul li',
          'description' => '2nd Level menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li:hover' => array(
          'label' => 'ul.menu ul li:hover',
          'description' => '2nd Level menu item (hovered)',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.expanded ul li a' => array(
          'label' => 'ul.menu ul li a',
          'description' => '2nd Level menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li a.active' => array(
          'label' => 'ul.menu ul li a.active',
          'description' => '2nd Level menu active item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li a:hover' => array(
          'label' => 'ul.menu ul li a:hover',
          'description' => '2nd Level menu item hovered link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li.active-trail' => array(
          'label' => 'ul.menu ul li.active-trail',
          'description' => '2nd Level active trail menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li.active-trail:hover' => array(
          'label' => 'ul.menu ul li.active-trail:hover',
          'description' => '2nd Level hovered active trail menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li.active-trail a' => array(
          'label' => 'ul.menu ul li.active-trail a',
          'description' => '2nd Level active trail menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul li.active-trail a:hovered' => array(
          'label' => 'ul.menu ul li.active-trail a:hovered',
          'description' => '2nd Level active trail menu item hovered link',
          'styles' => array(
            'freeform',
          ),
        ),
        // 3rd level menu
        '#main-menu ul li:hover ul' => array(
          'label' => 'ul ul li:hover ul',
          'description' => 'Expanded 3nd level container (dropdown)',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul' => array(
          'label' => 'ul.menu ul ul',
          'description' => '3rd Level menu container',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li' => array(
          'label' => 'ul.menu ul ul li',
          'description' => '3rd Level menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li:hover' => array(
          'label' => 'ul.menu ul ul li:hover',
          'description' => '3rd Level menu item (hovered)',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu li.expanded ul ul li a' => array(
          'label' => 'ul.menu ul ul li a',
          'description' => '3rd Level menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li a:hover' => array(
          'label' => 'ul.menu ul ul li a:hover',
          'description' => '3rd Level menu item hovered link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li a.active' => array(
          'label' => 'ul.menu ul ul li a.active',
          'description' => '3rd Level active menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li.active-trail' => array(
          'label' => 'ul.menu ul ul li.active-trail',
          'description' => '3rd Level active trail menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li.active-trail:hover' => array(
          'label' => 'ul.menu ul ul li.active-trail:hover',
          'description' => '3rd Level hovered active trail menu item',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li.active-trail a' => array(
          'label' => 'ul.menu ul ul li.active-trail a',
          'description' => '3rd Level active trail menu item link',
          'styles' => array(
            'freeform',
          ),
        ),
        '#main-menu ul ul li.active-trail a:hovered' => array(
          'label' => 'ul.menu ul ul li.active-trail a:hovered',
          'description' => '3rd Level active trail menu item hovered link',
          'styles' => array(
            'freeform',
          ),
        ),
      ),
    ),
    'tables' => array(
      'label' => 'Tables',
      'defaults_available' => true,
      'elements' => array(
        '.pg-wrap table' => array(
          'label' => 'table',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr' => array(
          'label' => 'table tr',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr th' => array(
          'label' => 'table tr th',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr th:first-child' => array(
          'label' => 'table tr th:first-child',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr th:last-child' => array(
          'label' => 'table tr th:last-child',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr th:only-child' => array(
          'label' => 'table tr th:only-child',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr td' => array(
          'label' => 'table tr td',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr td:first-child' => array(
          'label' => 'table tr td:first-child',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr td:last-child' => array(
          'label' => 'table tr td:last-child',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap table tr td:only-child' => array(
          'label' => 'table tr td:only-child',
          'description' => '',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    'lists' => array(
      'label' => 'Lists',
      'defaults_available' => true,
      'elements' => array(
        '.pg-wrap ul' => array(
          'label' => 'ul',
          'description' => 'unordered list',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap ul li' => array(
          'label' => 'ul li',
          'description' => 'unordered list item',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap ol' => array(
          'label' => 'ol',
          'description' => 'ordered list',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-wrap ol li' => array(
          'label' => 'ol li',
          'description' => 'ordered list item',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    'contact-block' => array(
      'label' => 'Contact Block',
      'defaults_available' => true,
      'elements' => array(
        '#block-pgc-contact-block-pgc-contact-block' => array(
          'label' => 'contact block container',
          'styles' => array(
            'freeform',
          )
        ),
        '#block-pgc-contact-block-pgc-contact-block .title' => array(
          'label' => 'contact block title',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-block' => array(
          'label' => 'contact block ul',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-block li' => array(
          'label' => 'contact block ul li',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-block li:hover' => array(
          'label' => 'contact block ul li:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-block li a' => array(
          'label' => 'contact block ul li a',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-block li a:hover' => array(
          'label' => 'contact block ul li a:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-block li span' => array(
          'label' => 'contact block ul li icon',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    'contact-footer-block' => array(
      'label' => 'Contact Footer Block',
      'defaults_available' => true,
      'elements' => array(
        '#block-pgc-contact-block-pgc-contact-footer-block' => array(
          'label' => 'contact footer block container',
          'styles' => array(
            'freeform',
          )
        ),
        '#block-pgc-contact-block-pgc-contact-footer-block .title' => array(
          'label' => 'contact footer block title',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-footer-block' => array(
          'label' => 'contact footer block ul',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-footer-block li' => array(
          'label' => 'contact footer block ul li',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-footer-block li:hover' => array(
          'label' => 'contact footer block ul li:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-footer-block li a' => array(
          'label' => 'contact footer block ul li a',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-footer-block li a:hover' => array(
          'label' => 'contact footer block ul li a:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc-contact-footer-block li span' => array(
          'label' => 'contact footer block ul li icon',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    'resource-block' => array(
      'label' => 'Resource Block',
      'defaults_available' => true,
      'elements' => array(
        '#pgc_resource_block' => array(
          'label' => 'resource block',
          'styles' => array(
            'freeform',
          )
        ),
        // #MSE-9 - Starts here
        '#pgc_resource_block:hover' => array(
          'label' => 'resource block:hover',
          'styles' => array(
            'freeform',
          )
        ),
        // #MSE-9 - Ends here
        '#pgc_resource_block a' => array(
          'label' => 'resource block a',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc_resource_block a:hover' => array(
          'label' => 'resource block a:hover',
          'styles' => array(
            'freeform',
          )
        ),
        // #MSE-9 - Starts here
        '#pgc_resource_block a.pgc-resource-icon' => array(
          'label' => 'resource block a icon',
          'styles' => array(
            'freeform',
          )
        ),
        '#pgc_resource_block a.pgc-resource-icon:hover' => array(
          'label' => 'resource block a:hover icon',
          'styles' => array(
            'freeform',
          )
        ),
        // #MSE-9 - Ends here
        '#pgc_resource_block span' => array(
          'label' => 'resource block icon',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    'gift-type' => array(
      'label' => 'Gift Type',
      'defaults_available' => true,
      'elements' => array(
        '.pg-gift-details .accordion-switch' => array(
          'label' => 'details accordion',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-gift-details .accordion-switch:hover' => array(
          'label' => 'details accordion:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-gift-details .accordion-switch a' => array(
          'label' => 'details accordion text link',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-gift-details .accordion-switch a:hover' => array(
          'label' => 'details accordion text link:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-gift-details .accordion-switch:hover a' => array(
          'label' => 'details accordion:hover text link',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-gift-details .accordion-switch span' => array(
          'label' => 'details accordion arrow',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    'breadcrumb' => array(
      'label' => 'Breadcrumb',
      'defaults_available' => true,
      'elements' => array(
        '.pg-breadcrumb' => array(
          'label' => 'breadcrumb container',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-breadcrumb .pg-breadcrumb-links' => array(
          'label' => 'breadcrumb text (non-links)',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-breadcrumb .pg-breadcrumb-links a' => array(
          'label' => 'breadcrumb a',
          'styles' => array(
            'freeform',
          )
        ),
        '.pg-breadcrumb .pg-breadcrumb-links a:hover' => array(
          'label' => 'breadcrumb a:hover',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    /* #PGCS-595 - How Your Gift Helps*/
    'how-your-gift-helps' => array(
      'label' => 'How Your Gift Helps',
      'defaults_available' => true,
      'elements' => array(
        '.pg-how-gift-helps-item-text' => array(
          'label' => 'How Your Gift Helps Image Text',
          'styles' => array(
            'freeform',
          )
        ),        
      )
    ),
    /* #PGCS-595 */
    /* #PGCS-445 - Mobile naviation bar*/
    'mobile-navigation-bar' => array(
      'label' => 'Mobile Navigation Bar',
      'defaults_available' => true,
      'elements' => array(
        '#block-pgc-misc-blocks-mobilenav .header-mobile' => array(
          'label' => 'Mobile Navigation Bar Color',
          'styles' => array(
            'freeform',
          )
        ),    
        '#block-pgc-misc-blocks-mobilenav .control.open-btn::before' => array(
          'label' => 'Mobile Navigation Bar Color Open Button',
          'styles' => array(
            'freeform',
          )
        ),  
        '#block-pgc-misc-blocks-mobilenav .control.close-btn::before' => array(
          'label' => 'Mobile Navigation Bar Color Close Button',
          'styles' => array(
            'freeform',
          )
        ),        
      )
    ),
    /* #PGCS-950 - Accordion */
    'accordion' => array(
      'label' => 'Accordion',
      'defaults_available' => false,
      'elements' => array(
        '.field-name-field-accordion .field-items .even .group-accordion-wrapper .field-name-field-accordion-title' => array(
          'label' => 'Even - Accordion Title',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .even .group-accordion-wrapper .field-name-field-accordion-title:hover' => array(
          'label' => 'Even - Accordion Title:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .even .group-accordion-wrapper .field-name-field-accordion-body' => array(
          'label' => 'Even - Accordion Detail',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .even .group-accordion-wrapper .field-name-field-accordion-title .ui-icon' => array(
          'label' => 'Even - Accordion Arrow',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .odd .group-accordion-wrapper .field-name-field-accordion-title' => array(
          'label' => 'Odd - Accordion Title',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .odd .group-accordion-wrapper .field-name-field-accordion-title:hover' => array(
          'label' => 'Odd - Accordion Title:hover',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .odd .group-accordion-wrapper .field-name-field-accordion-body' => array(
          'label' => 'Odd - Accordion Detail',
          'styles' => array(
            'freeform',
          )
        ),
        '.field-name-field-accordion .field-items .odd .group-accordion-wrapper .field-name-field-accordion-title .ui-icon' => array(
          'label' => 'Odd - Accordion Arrow',
          'styles' => array(
            'freeform',
          )
        ),
      )
    ),
    /* #PGCS-676 */
    'webform' => array(
      'label' => 'Webform Label',
      'defaults_available' => false,
      'elements' => array(
        '.webform-component label' => array(
          'label' => 'Label',
          'styles' => array(
            'font-weight',
          ),
        ),
      ),
    ),
    /* #PGCS-676 */
    /* #MSE-31 - Starts Here*/
    'brochure-pages' => array(
      'label' => 'Brochure Pages',
      'defaults_available' => true,
      'elements' => array(
        '.pgc-brochure-bg-top' => array(
          'label' => 'Brochure - Top Banner',
          'styles' => array(
            'freeform',
          )
        ),         
        '.pgc-brochure-header-text' => array(
          'label' => 'Brochure - Header',
          'styles' => array(
            'freeform',
          )
        ),
        '.pgc-brochure-logo' => array(
          'label' => 'Brochure - Logo Wrapper',
          'styles' => array(
            'freeform',
          )
        ),
        '.pgc-brochure-logo img' => array(
          'label' => 'Brochure - Logo Image',
          'styles' => array(
            'freeform',
          )
        ),
        '.pgc-brochure-title' => array(
          'label' => 'Brochure - Title',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-body-title.pgc-font-color1' => array(
          'label' => 'Brochure - Paragraph Title 1',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-body-title.pgc-font-color2' => array(
          'label' => 'Brochure - Paragraph Title 2',
          'styles' => array(
            'freeform',
          )
        ),
        '.pgc-brochure-body' => array(
          'label' => 'Brochure - Body',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-body p' => array(
          'label' => 'Brochure - Body p',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-body-text ul' => array(
          'label' => 'Brochure - Body ul',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-body-text ul li' => array(
          'label' => 'Brochure - Body ul li',
          'styles' => array(
            'freeform',
          )
        ),
        '.pgc-brochure-body-text ul li span.pgc-before::before' => array(
          'label' => 'Brochure - Body ul li bullets',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-footer-text' => array(
          'label' => 'Brochure - Contact Box Container',
          'styles' => array(
            'freeform',
          )
        ), 
        '.pgc-brochure-footer-title' => array(
          'label' => 'Brochure - Contact Box Title',
          'styles' => array(
            'freeform',
          )
        ),  
        'span.pgc-brochure-footer-contact' => array(
          'label' => 'Brochure - Contact Box - Email/Phone',
          'styles' => array(
            'freeform',
          )
        ),
        '.pgc-font-color1' => array(
          'label' => 'Font color 1',
          'styles' => array(
            'color',
          ),
        ),
        '.pgc-font-color2' => array(
          'label' => 'Font color 2',
          'styles' => array(
            'color',
          ),
        ),
      )
    ),
    /* #MSE-31 - Ends Here*/
  );
}
function site_ingestor_get_default_css($section) {
  $defaults = array();
  $file = file_get_contents(drupal_get_path('theme', 'pgcalc_master').'/css/'.$section.'.css');
  preg_match_all('/([^{]*){([^}]*)}/ism', $file, $matches);
  foreach($matches[1] as $key => $selector) {
    $selector = trim($selector);
    $styles = $matches[2][$key];
    $styles = explode("\n", $styles);
    foreach($styles as $style) {
      if(strlen($style)) {
        $property = trim(substr($style, 0, strpos($style, ':')));
        $style = str_replace(';', '', trim(substr($style, strpos($style, ':')+1)));
        $defaults[$selector][$property] = $style;
      }
    }
  }

  return $defaults;
}

/**
 * Similar to above function, but gets CSS from an existing theme
 */
function site_ingestor_get_existing_css($themePath) {
  $defaults = array();
  $file = file_get_contents($themePath.'/overrides.css');
  preg_match_all('/([^{]*){([^}]*)}/ism', $file, $matches);
  foreach($matches[1] as $key => $selector) {
    $selector = trim($selector);
    $styles = trim($matches[2][$key]);
    $styles = explode("\n", $styles);
    foreach($styles as $style) {
      if(strlen($style)) {
        $property = trim(substr($style, 0, strpos($style, ':')));
        $style = str_replace(';', '', trim(substr($style, strpos($style, ':')+1)));
        $defaults[$selector][$property] = $style;
      }
    }
  }

  return $defaults;
}