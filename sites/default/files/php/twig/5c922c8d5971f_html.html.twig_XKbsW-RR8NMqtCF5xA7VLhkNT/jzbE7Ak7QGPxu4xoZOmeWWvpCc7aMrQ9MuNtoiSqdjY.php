<?php

/* themes/humboldt2/html.html.twig */
class __TwigTemplate_d468ead1d22fb6d25f9c9994ea6b3cabdf69476643b5b0979e1239c39aeff67f extends Twig_Template
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
        $filters = array("safe_join" => 12, "raw" => 27);
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array(),
                array('safe_join', 'raw'),
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
        echo "<!DOCTYPE html>
\t<!--[if lt IE 7]> <html class=\"no-js lt-ie9 lt-ie8 lt-ie7\" original-class=\"no-js lt-ie9 lt-ie8 lt-ie7\"> <![endif]-->
\t<!--[if IE 7]> <html class=\"no-js lt-ie9 lt-ie8\" original-class=\"no-js lt-ie9 lt-ie8\"> <![endif]-->
\t<!--[if IE 8]> <html class=\"no-js lt-ie9\" original-class=\"no-js lt-ie9\"> <![endif]-->
\t<!--[if gt IE 8]><!-->
\t<html class=\"no-js\" original-class=\"no-js\">
\t<!--<![endif]-->
\t\t<head profile=\"http://www.w3.org/1999/xhtml/vocab\">
\t\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\t\t
\t\t\t<link rel=\"shortcut icon\" href=\"/themes/humboldt2/linked/favicon.ico\" type=\"image/vnd.microsoft.icon\">
\t\t\t<meta name=\"Generator\" content=\"Drupal 8 (http://drupal.org)\">
\t\t\t<title>";
        // line 12
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->safeJoin($this->env, ($context["head_title"] ?? null), " | ")));
        echo "</title>
\t\t\t<meta name=\"description\" content=\"\">
\t\t\t<meta name=\"viewport\" content=\"width=device-width\">
\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/themes/humboldt2/css/d19a87eda448e553a1fcca518a89a4c6.css\" media=\"all\">
\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/themes/humboldt2/css/38a5be85a424138e30cad4d4dc082973.css\" media=\"all\">
\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/themes/humboldt2/css/2a5b4daca59358fcf92ef3ec26ebe447.css\" media=\"all\">
\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/themes/humboldt2/css/ce4dff7630ed2623ee41441d656b6864.css\" media=\"all\">
\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/themes/humboldt2/css/1a6c6dfc70c4e1835114868375616aba.css\" media=\"all\">
\t\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"/themes/humboldt2/css/e785a3dbbccef7faa886711c91fff637.css\" media=\"all\">
\t\t\t<script type=\"text/javascript\" src=\"/themes/humboldt2/js/respond.min.js\"></script>
\t\t\t<script type=\"text/javascript\" src=\"/themes/humboldt2/js/a1d08a552749319931e1e1ef6ea23578.js\"></script>
\t\t\t<script type=\"text/javascript\" src=\"/themes/humboldt2/js/01c7712a537905bef6c86f5121429d9d.js\"></script>
\t\t\t<script type=\"text/javascript\" src=\"/themes/humboldt2/js/b863ec028c0f030500c5827f69dfebdf.js\"></script>
\t\t\t<script type=\"text/javascript\" src=\"/themes/humboldt2/js/2ddad04db51965856efb05f168917e06.js\"></script>
\t\t\t<script type=\"text/javascript\" src=\"/themes/humboldt2/js/e275614cc335d69f15cb298b6b5f9a37.js\"></script>\t\t
\t\t\t<css-placeholder token=\"";
        // line 27
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(($context["placeholder_token"] ?? null)));
        echo "\">
\t    \t<js-placeholder token=\"";
        // line 28
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(($context["placeholder_token"] ?? null)));
        echo "\">
\t\t\t<!--[if IE 7]>
\t\t\t<link rel=\"stylesheet\" href=\"/themes/pgcalc_master/ie7/ie7.css\">
\t\t\t<![endif]-->
\t\t</head>
\t\t";
        // line 33
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["page_top"] ?? null), "html", null, true));
        echo "
\t    ";
        // line 34
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["page"] ?? null), "html", null, true));
        echo "
\t    ";
        // line 35
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["page_bottom"] ?? null), "html", null, true));
        echo "
\t    <js-bottom-placeholder token=\"";
        // line 36
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(($context["placeholder_token"] ?? null)));
        echo "\">    
\t</html>
";
    }

    public function getTemplateName()
    {
        return "themes/humboldt2/html.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  98 => 36,  94 => 35,  90 => 34,  86 => 33,  78 => 28,  74 => 27,  56 => 12,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/humboldt2/html.html.twig", "D:\\xampp\\htdocs\\pgcal-d8\\themes\\humboldt2\\html.html.twig");
    }
}
