<?php

class Pprek24_SocialNavWalker extends Walker_Nav_Menu {
  public function start_lvl (&$output, $depth = 0, $args = null): void {
    $output .= '<ul>';
  }

  public function start_el (&$output, $data_object, $depth = 0, $args = null, $current_object_id = 0): void {
    $output .= '<li>';

    $this->render_el($output, $data_object, $depth, $args, $current_object_id);
  }

  protected function render_el (string &$output, WP_Post $item, int $depth, stdClass $args, int $id): void {
    $output .= '<a href="' . esc_url($item->url) . '" title="' . esc_attr($item->attr_title) . '">';
    $output .= '<i aria-hidden="true" class="bi bi-' . $item->title . '"></i>';
    $output .= '</a>';
  }

  public function end_el (&$output, $data_object, $depth = 0, $args = null): void {
    $output .= '</li>';
  }

  public function end_lvl (&$output, $depth = 0, $args = null): void {
    $output .= '</ul>';
  }
}
