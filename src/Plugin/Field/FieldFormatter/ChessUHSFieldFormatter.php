<?php

namespace Drupal\link\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

use Drupal\Component\Utility\Unicode;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'Chess-UHS' formatter.
 *
 * @FieldFormatter(
 *   id = "chessuhsfieldformatter",
 *   module = "chess_uhs_field",
 *   label = @Translation("Chess-UHS Field"),
 *   field_types = {
 *     "chess_uhs_field"
 *   }
 * )
 */
class ChessUHSFieldFormatter extends FormatterBase {

/**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    $summary[] = $this->t('Displays the score.');
    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = [];

    foreach ($items as $delta => $item) {
      // Render each element as markup.
      $element[$delta] = ['#markup' => $item->value];
    }

    return $element;
  }
}
