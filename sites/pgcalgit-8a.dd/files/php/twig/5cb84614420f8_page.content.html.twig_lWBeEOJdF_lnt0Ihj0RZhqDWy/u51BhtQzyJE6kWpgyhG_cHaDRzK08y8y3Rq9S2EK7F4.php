<?php

/* /themes/pgcalc_master/templates/page.content.html.twig */
class __TwigTemplate_eaed2d6883796853a9d32810df45be8fb269c7ff5183e4d067423760a7a41646 extends Twig_Template
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
        $tags = array("if" => 2);
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if'),
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
        echo "<div class=\"pg-wrap\">
  ";
        // line 2
        if ($this->getAttribute(($context["page"] ?? null), "titlebar_blocks", array())) {
            // line 3
            echo "    <div class=\"pg-page-header\">
      ";
            // line 4
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "titlebar_blocks", array()), "html", null, true));
            echo "
    </div>
  ";
        }
        // line 7
        echo "  ";
        if ($this->getAttribute(($context["page"] ?? null), "content_top", array())) {
            // line 8
            echo "    <div class=\"pg-content-top\">
      ";
            // line 9
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content_top", array()), "html", null, true));
            echo "
    </div>
  ";
        }
        // line 12
        echo "  ";
        if ($this->getAttribute(($context["page"] ?? null), "content_inline_blocks", array())) {
            // line 13
            echo "    <div class=\"pg-content-inline-blocks\">
      ";
            // line 14
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content_inline_blocks", array()), "html", null, true));
            echo "
    </div>
  ";
        }
        // line 17
        echo "  ";
        if ($this->getAttribute(($context["page"] ?? null), "content", array())) {
            // line 18
            echo "    <div class=\"pg-content-body\">
      ";
            // line 19
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content", array()), "html", null, true));
            echo "
    </div>
  ";
        }
        // line 22
        echo "  ";
        if ($this->getAttribute(($context["page"] ?? null), "content_footer", array())) {
            // line 23
            echo "    <div class=\"pg-content-footer\">
      ";
            // line 24
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content_footer", array()), "html", null, true));
            echo "
    </div>
  ";
        }
        // line 27
        echo "</div>
";
    }

    public function getTemplateName()
    {
        return "/themes/pgcalc_master/templates/page.content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  105 => 27,  99 => 24,  96 => 23,  93 => 22,  87 => 19,  84 => 18,  81 => 17,  75 => 14,  72 => 13,  69 => 12,  63 => 9,  60 => 8,  57 => 7,  51 => 4,  48 => 3,  46 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/themes/pgcalc_master/templates/page.content.html.twig", "D:\\xampp\\htdocs\\pgcalgit\\themes\\pgcalc_master\\templates\\page.content.html.twig");
    }
}
