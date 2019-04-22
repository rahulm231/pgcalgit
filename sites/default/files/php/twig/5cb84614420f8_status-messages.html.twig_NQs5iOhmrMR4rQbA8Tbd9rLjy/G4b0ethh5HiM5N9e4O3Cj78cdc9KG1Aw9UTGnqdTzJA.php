<?php

/* core/themes/stable/templates/misc/status-messages.html.twig */
class __TwigTemplate_3adddb30cf2797a97e1037a6b6c8d433e75d3bea53665ffa78aa53a81ea6d640 extends Twig_Template
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
        $tags = array("for" => 22, "if" => 24);
        $filters = array("without" => 23, "length" => 30, "first" => 37);
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('for', 'if'),
                array('without', 'length', 'first'),
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

        // line 22
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["message_list"] ?? null));
        foreach ($context['_seq'] as $context["type"] => $context["messages"]) {
            // line 23
            echo "  <div role=\"contentinfo\" aria-label=\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["status_headings"] ?? null), $context["type"], array(), "array"), "html", null, true));
            echo "\"";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_without(($context["attributes"] ?? null), "role", "aria-label"), "html", null, true));
            echo ">
    ";
            // line 24
            if (($context["type"] == "error")) {
                // line 25
                echo "      <div role=\"alert\">
    ";
            }
            // line 27
            echo "      ";
            if ($this->getAttribute(($context["status_headings"] ?? null), $context["type"], array(), "array")) {
                // line 28
                echo "        <h2 class=\"visually-hidden\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["status_headings"] ?? null), $context["type"], array(), "array"), "html", null, true));
                echo "</h2>
      ";
            }
            // line 30
            echo "      ";
            if ((twig_length_filter($this->env, $context["messages"]) > 1)) {
                // line 31
                echo "        <ul>
          ";
                // line 32
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($context["messages"]);
                foreach ($context['_seq'] as $context["_key"] => $context["message"]) {
                    // line 33
                    echo "            <li>";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $context["message"], "html", null, true));
                    echo "</li>
          ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['message'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 35
                echo "        </ul>
      ";
            } else {
                // line 37
                echo "        ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_first($this->env, $context["messages"]), "html", null, true));
                echo "
      ";
            }
            // line 39
            echo "    ";
            if (($context["type"] == "error")) {
                // line 40
                echo "      </div>
    ";
            }
            // line 42
            echo "  </div>
";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['type'], $context['messages'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "core/themes/stable/templates/misc/status-messages.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  105 => 42,  101 => 40,  98 => 39,  92 => 37,  88 => 35,  79 => 33,  75 => 32,  72 => 31,  69 => 30,  63 => 28,  60 => 27,  56 => 25,  54 => 24,  47 => 23,  43 => 22,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "core/themes/stable/templates/misc/status-messages.html.twig", "D:\\xampp\\htdocs\\pgcalgit\\core\\themes\\stable\\templates\\misc\\status-messages.html.twig");
    }
}
