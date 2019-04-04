<?php

namespace Drupal\kingfish\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 *
 * @Block(
 *   id = "block_chessmoves",
 *   admin_label = @Translation("Piyon Akademi :: Chessboard moves block"),
 *   category = @Translation("Piyon Akademi")
 * )
 */
class KingFishMovesBlock extends BlockBase
{

   /**
   * {@inheritdoc}
   */
    public function build()
    {
        $build = [];
        $block = [
            '#theme' => 'block_chessmoves',
            '#attributes' => [
                'class' => ['chessboard'],
                'id' => 'chessmoves-block',
            ],
        ];
        $build['chessmoves_block'] = $block;
        return $build;
    }
}
