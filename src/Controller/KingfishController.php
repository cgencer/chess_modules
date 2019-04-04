<?php

namespace Drupal\kingfish\Controller;

use Drupal\kingfish\Utility\DescriptionTemplateTrait;

/**
 * Controller routines for block example routes.
 */
class KingfishController {
  use DescriptionTemplateTrait;

  /**
   * {@inheritdoc}
   */
  protected function getModuleName() {
    return 'kingfish';
  }
}
