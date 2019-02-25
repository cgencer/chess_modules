<?php

namespace Drupal\chess_uhs_field\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'link' widget.
 *
 * @FieldWidget(
 *   id = "chessuhsfieldwidget",
 *   module = "chess_uhs_field",
 *   label = @Translation("Chess-UHS Field"),
 *   field_types = {
 *     "chess_uhs_field"
 *   }
 * )
 */
class ChessUHSFieldWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = isset($items[$delta]->value) ? $items[$delta]->value : '';
    $element += [
      '#type' => 'textfield',
      '#default_value' => $value,
      '#size' => 5,
      '#maxlength' => 5,
      '#element_validate' => [
        [$this, 'validate'],
      ],
    ];
    return ['value' => $element];
  }

  /**
   * Validate the UHS-field
   */
  public function validate($element, FormStateInterface $form_state) {
    $value = $element['#value'];
    if (strlen($value) == 0) {
      $form_state->setValueForElement($element, '');
      return;
    }
    if (!preg_match('/^#([0-9]{4})$/iD', strtolower($value))) {
      $form_state->setError($element, $this->t("UHS score must be a 4-digit decimal value, showing the score."));
    }
  }

}