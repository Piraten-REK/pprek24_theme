<?php

class Pprek24_SocialNavWalker extends Walker_Nav_Menu {
  public function start_lvl (&$output, $depth = 0, $args = null) {
    $output .= '<ul>';
  }

  public function start_el (&$output, $item, $depth = 0, $args = null, $id = 0) {
    $output .= '<li>';

    $this->render_el($output, $item, $depth, $args, $id);
  }

  protected function render_el (string &$output, WP_Post $item, int $depth, stdClass $args, int $id) {
    $output .= '<a href="' . esc_url($item->url) . '" title="' . esc_attr($item->attr_title) . '">';
    $output .= '<i aria-hidden="true" class="bi bi-' . $item->title . '"></i>';
    $output .= '</a>';
  }

  public function end_el (&$output, $item, $depth = 0, $args = null) {
    $output .= '</li>';
  }

  public function end_lvl (&$output, $depth = 0, $args = null) {
    $output .= '</ul>';
  }
}
