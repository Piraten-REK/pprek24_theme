<?php

class Pprek24_PrimaryNavWalker extends Pprek24_NavWalker {
  protected string $parentName = '_btn';

  protected function render_el (string &$output, WP_Post $item, int $depth, stdClass $args, int $id): void {
    // Labels
    $hasChildren = in_array('menu-item-has-children', $item->classes, true);

    if ($hasChildren) {
      $output .= '<button id="_site-nav_sub' . ++$this->sub . $this->parentName . '" class="site-nav-accordion-toggler" aria-expanded="false" aria-controls="_site-nav_sub' . $this->sub . '">';
      $output .= '<span>' . $item->title . '</span>';
      $output .= '</button>';
      return;
    }

    parent::render_el($output, $item, $depth, $args, $id);
  }
}
