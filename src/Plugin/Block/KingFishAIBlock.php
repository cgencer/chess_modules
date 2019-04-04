<?php

namespace Drupal\kingfish\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 *
 * @Block(
 *   id = "block_chessAI",
 *   admin_label = @Translation("Piyon Akademi :: Chess AI block"),
 *   category = @Translation("Piyon Akademi")
 * )
 */
class KingFishAIBlock extends BlockBase
{

   /**
   * {@inheritdoc}
   */
    public function build()
    {
        $build = [];
        $block = [
        '#theme' => 'block_chessAI',
        '#attributes' => [
        'class' => ['chessboard'],
        'id' => 'chessAI-block',
        ],
        ];
        $build['chessAI-block'] = $block;
        return $build;
    }
}
