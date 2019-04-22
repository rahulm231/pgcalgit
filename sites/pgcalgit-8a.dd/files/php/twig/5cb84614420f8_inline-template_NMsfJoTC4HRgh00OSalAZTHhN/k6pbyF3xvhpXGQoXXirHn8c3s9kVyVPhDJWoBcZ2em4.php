<?php

/* {# inline_template_start #}<li class="line"><a href="{{ field_link_1__uri }}" title="{{ field_link_1__title }}"><span class="icon-{{ field_icon_1 }}"></span></a><a href="{{ field_link_1__uri }}" title="{{ field_link_1__title }}">{{ field_link_1__title }}</a></li> */
class __TwigTemplate_c7f3cd3ed0b440c51e39d5472b5f623f64b8a793c130ef72bf34c223eb4a4fa0 extends Twig_Template
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
        echo "<li class=\"line\"><a href=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_1__uri"] ?? null), "html", null, true));
        echo "\" title=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_1__title"] ?? null), "html", null, true));
        echo "\"><span class=\"icon-";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_icon_1"] ?? null), "html", null, true));
        echo "\"></span></a><a href=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_1__uri"] ?? null), "html", null, true));
        echo "\" title=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_1__title"] ?? null), "html", null, true));
        echo "\">";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["field_link_1__title"] ?? null), "html", null, true));
        echo "</a></li>";
    }

    public function getTemplateName()
    {
        return "{# inline_template_start #}<li class=\"line\"><a href=\"{{ field_link_1__uri }}\" title=\"{{ field_link_1__title }}\"><span class=\"icon-{{ field_icon_1 }}\"></span></a><a href=\"{{ field_link_1__uri }}\" title=\"{{ field_link_1__title }}\">{{ field_link_1__title }}</a></li>";
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
        return new Twig_Source("", "{# inline_template_start #}<li class=\"line\"><a href=\"{{ field_link_1__uri }}\" title=\"{{ field_link_1__title }}\"><span class=\"icon-{{ field_icon_1 }}\"></span></a><a href=\"{{ field_link_1__uri }}\" title=\"{{ field_link_1__title }}\">{{ field_link_1__title }}</a></li>", "");
    }
}
