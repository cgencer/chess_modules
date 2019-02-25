<?php

namespace Drupal\chess_uhs_field\Plugin\Field\FieldType;

use Drupal\Core\TypedData\DataDefinition;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldItemInterface;

/**
 * Plugin implementation of the 'Chess-UHS' field type.
 *
 * @FieldType(
 *   id = "chess_uhs_field",
 *   label = @Translation("Chess-UHS Field"),
 *   description = @Translation("Allows you to grab UHS scores from Turkish Chess Federation pages."),
 *   default_widget = "chessuhsfieldwidget",
 *   default_formatter = "chessuhsfieldformatter",
 * )
 */
class ChessUHSFieldItem extends FieldItemBase implements FieldItemInterface {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
      return [
        'columns' => [
          'value' => [
            'type' => 'integer',
            'unsigned' => true,
            'default' => 0,
          ],
        ],
      ];
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
      $properties = [];
      $properties['value'] = DataDefinition::create('int');

      return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultFieldSettings() {
    return [
      // Declare a single setting, 'size', with a default
      // value of 'large'
      'size' => 'normal',
    ] + parent::defaultFieldSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $value = $this->get('uhs')->getValue();
    return $value === NULL || $value === '';
  }

}