<?php

namespace Drupal\kingfish\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 *
 * @Block(
 *   id = "block_chessbuttons",
 *   admin_label = @Translation("Piyon Akademi :: Chessboard buttons block"),
 *   category = @Translation("Piyon Akademi")
 * )
 */
class KingFishButtonsBlock extends BlockBase
{

   /**
   * {@inheritdoc}
   */
    public function build()
    {
        $build = [];
        $block = [
            '#theme' => 'block_chessbuttons',
            '#attributes' => [
                'class' => ['chessboard'],
                'id' => 'chessbuttons-block',
            ],
        ];
        $build['chessbuttons_block'] = $block;
        return $build;
    }
}
