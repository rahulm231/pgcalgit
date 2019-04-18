<?php

/* {# inline_template_start #}<div id="titlebar-links">
  <div class="pgc-font-size">
    <a href="javascript:void(0);" class="increase">Text +</a><a href="javascript:void(0);" class="decrease">Text -</a>
  </div>
  <div class="pgc-share pgc-title-btn">
    <span class="icon-share"></span>
    <div class="addthis_toolbox addthis_default_style ">
      <a class="addthis_counter addthis_pill_style"></a>
    </div>
  </div>
  <div class="pgc-print pgc-title-btn">  	
    <a href="/pgc-print/" target="_blank"><span class="icon-print"></span></a>
  </div>
  <div class="pgc-email pgc-title-btn">
    <a href="mailto:?subject={{ field_email_subject |convert_encoding('UTF-8', 'HTML-ENTITIES') | raw }}&body={{ field_email_body |convert_encoding('UTF-8', 'HTML-ENTITIES') | raw }}"><span class="icon-email"></span></a>
  </div>
</div>
 */
class __TwigTemplate_ed3a1b415a1b49ee7a35d2ac040a3463fb92916af983ec7db839c78f020cc555 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array();
        $filters = array("raw" => 15, "convert_encoding" => 15);
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array(),
                array('raw', 'convert_encoding'),
                array()
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        echo "<div id=\"titlebar-links\">
  <div class=\"pgc-font-size\">
    <a href=\"javascript:void(0);\" class=\"increase\">Text +</a><a href=\"javascript:void(0);\" class=\"decrease\">Text -</a>
  </div>
  <div class=\"pgc-share pgc-title-btn\">
    <span class=\"icon-share\"></span>
    <div class=\"addthis_toolbox addthis_default_style \">
      <a class=\"addthis_counter addthis_pill_style\"></a>
    </div>
  </div>
  <div class=\"pgc-print pgc-title-btn\">  \t
    <a href=\"/pgc-print/\" target=\"_blank\"><span class=\"icon-print\"></span></a>
  </div>
  <div class=\"pgc-email pgc-title-btn\">
    <a href=\"mailto:?subject=";
        // line 15
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(twig_convert_encoding(($context["field_email_subject"] ?? null), "UTF-8", "HTML-ENTITIES")));
        echo "&body=";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(twig_convert_encoding(($context["field_email_body"] ?? null), "UTF-8", "HTML-ENTITIES")));
        echo "\"><span class=\"icon-email\"></span></a>
  </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "{# inline_template_start #}<div id=\"titlebar-links\">
  <div class=\"pgc-font-size\">
    <a href=\"javascript:void(0);\" class=\"increase\">Text +</a><a href=\"javascript:void(0);\" class=\"decrease\">Text -</a>
  </div>
  <div class=\"pgc-share pgc-title-btn\">
    <span class=\"icon-share\"></span>
    <div class=\"addthis_toolbox addthis_default_style \">
      <a class=\"addthis_counter addthis_pill_style\"></a>
    </div>
  </div>
  <div class=\"pgc-print pgc-title-btn\">  \t
    <a href=\"/pgc-print/\" target=\"_blank\"><span class=\"icon-print\"></span></a>
  </div>
  <div class=\"pgc-email pgc-title-btn\">
    <a href=\"mailto:?subject={{ field_email_subject |convert_encoding('UTF-8', 'HTML-ENTITIES') | raw }}&body={{ field_email_body |convert_encoding('UTF-8', 'HTML-ENTITIES') | raw }}\"><span class=\"icon-email\"></span></a>
  </div>
</div>
";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  76 => 15,  60 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "{# inline_template_start #}<div id=\"titlebar-links\">
  <div class=\"pgc-font-size\">
    <a href=\"javascript:void(0);\" class=\"increase\">Text +</a><a href=\"javascript:void(0);\" class=\"decrease\">Text -</a>
  </div>
  <div class=\"pgc-share pgc-title-btn\">
    <span class=\"icon-share\"></span>
    <div class=\"addthis_toolbox addthis_default_style \">
      <a class=\"addthis_counter addthis_pill_style\"></a>
    </div>
  </div>
  <div class=\"pgc-print pgc-title-btn\">  \t
    <a href=\"/pgc-print/\" target=\"_blank\"><span class=\"icon-print\"></span></a>
  </div>
  <div class=\"pgc-email pgc-title-btn\">
    <a href=\"mailto:?subject={{ field_email_subject |convert_encoding('UTF-8', 'HTML-ENTITIES') | raw }}&body={{ field_email_body |convert_encoding('UTF-8', 'HTML-ENTITIES') | raw }}\"><span class=\"icon-email\"></span></a>
  </div>
</div>
", "");
    }
}
