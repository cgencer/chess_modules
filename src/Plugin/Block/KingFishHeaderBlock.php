<?php

namespace Drupal\kingfish\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 *
 * @Block(
 *   id = "block_chessheader",
 *   admin_label = @Translation("Piyon Akademi :: Chessboard header block"),
 *   category = @Translation("Piyon Akademi")
 * )
 */
class KingFishHeaderBlock extends BlockBase
{

   /**
   * {@inheritdoc}
   */
    public function build()
    {
        $build = [];
        $block = [
            '#theme' => 'block_chessheader',
            '#attributes' => [
                'class' => ['chessboard'],
                'id' => 'chessheader-block',
            ],
        ];
        $build['chessheader_block'] = $block;
        return $build;
    }
}
