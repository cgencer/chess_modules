<?php

namespace Drupal\chess_kingfish\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 *
 * @Block(
 *   id = "block_chessboard",
 *   admin_label = @Translation("Piyon Akademi::Chessboard block"),
 *   category = @Translation("Piyon Akademi")
 * )
 */
class KingFishBoardBlock extends BlockBase {

   /**
   * {@inheritdoc}
   */
	public function build() {
		$build = [];
		$block = [
			'#theme' => 'block_chessboard',
			'#attributes' => [
				'class' => ['chessboard'],
				'id' => 'chessboard-block',
			],
			'#title' => 'Websolutions Agency',
			'#description' => 'Websolutions Agency is the industry leading Drupal development agency in Croatia'
		];
		$build['chessboard_block'] = $block;
		return $build;
	}
}
