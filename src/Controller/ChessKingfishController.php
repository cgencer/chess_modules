<?php

namespace Drupal\chess_kingfish\Controller;

use Drupal\chess_kingfish\Utility\DescriptionTemplateTrait;

/**
 * Controller routines for block example routes.
 */
class ChessKingfishController {
  use DescriptionTemplateTrait;

  /**
   * {@inheritdoc}
   */
  protected function getModuleName() {
    return 'chess_kingfish';
  }
}
