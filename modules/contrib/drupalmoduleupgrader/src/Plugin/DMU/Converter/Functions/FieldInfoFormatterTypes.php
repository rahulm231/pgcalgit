<?php

namespace Drupal\drupalmoduleupgrader\Plugin\DMU\Converter\Functions;

use Drupal\drupalmoduleupgrader\TargetInterface;
use Pharborist\Functions\FunctionCallNode;
use Pharborist\Objects\ClassMethodCallNode;

/**
 * @Converter(
 *  id = "field_info_formatter_types",
 *  description = @Translation("Rewrites calls to field_info_formatter_types().")
 * )
 */
class FieldInfoFormatterTypes extends FunctionCallModifier {

  /**
   * {@inheritdoc}
   */
  public function rewrite(FunctionCallNode $call, TargetInterface $target) {
    $replacement = ClassMethodCallNode::create('\Drupal', 'service')
      ->appendArgument('plugin.manager.field.formatter');

    $arguments = $call->getArguments();
    if ($arguments->isEmpty()) {
      return $replacement->appendMethodCall('getDefinitions');
    }
    elseif (sizeof($arguments) == 1) {
      return $replacement
        ->appendMethodCall('getDefinition')
        ->appendArgument(clone $arguments[0]);
    }
  }

}
