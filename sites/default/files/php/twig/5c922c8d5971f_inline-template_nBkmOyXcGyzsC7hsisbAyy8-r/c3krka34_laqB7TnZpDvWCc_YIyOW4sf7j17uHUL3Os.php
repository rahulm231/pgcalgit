<?php

/* {# inline_template_start #}<div id="block-pgc-contact-block-pgc-contact-footer-block"><div class="content"><ul id="pgc-contact-footer-block">{{ field_link_1 }}{{ field_link_2 }}{{ field_link_3 }}{{ field_link_4 }}</ul></div></div> */
class __TwigTemplate_66c9f4afe5d13f051fd66baa0099cf4ea8ef8033f4acfb1291ba48cefde8be58 extends Twig_Template
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
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array(),
                array(),
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
        echo "<div id=\"block-pgc-contact-block-pgc-contact-footer-block\"><div class=\"content\"><ul id=\"pgc-contact-footer-block\">";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_1"] ?? null), "html", null, true));
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_2"] ?? null), "html", null, true));
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_3"] ?? null), "html", null, true));
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_4"] ?? null), "html", null, true));
        echo "</ul></div></div>";
    }

    public function getTemplateName()
    {
        return "{# inline_template_start #}<div id=\"block-pgc-contact-block-pgc-contact-footer-block\"><div class=\"content\"><ul id=\"pgc-contact-footer-block\">{{ field_link_1 }}{{ field_link_2 }}{{ field_link_3 }}{{ field_link_4 }}</ul></div></div>";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "{# inline_template_start #}<div id=\"block-pgc-contact-block-pgc-contact-footer-block\"><div class=\"content\"><ul id=\"pgc-contact-footer-block\">{{ field_link_1 }}{{ field_link_2 }}{{ field_link_3 }}{{ field_link_4 }}</ul></div></div>", "");
    }
}
