<?php

class Pprek24_NavWalker extends Walker_Nav_Menu {
  protected int $sub = 0;
  protected string $parentName = '_parent';

  public function start_lvl (&$output, $depth = 0, $args = null): void {
    $output .= '<ul id="_site-nav_sub' . $this->sub . '" aria-labelledby="_site-nav_sub' . $this->sub . $this->parentName . '">';
  }

  public function start_el (&$output, $data_object, $depth = 0, $args = null, $current_object_id = 0): void {
    $output .= '<li>';

    $this->render_el($output, $data_object, $depth, $args, $current_object_id);
  }

  protected function render_el (string &$output, WP_Post $item, int $depth, stdClass $args, int $id): void {
    // Separator
    if (str_starts_with($item->title, '---')) {
      $output .= '<hr>';
      return;
    }

    // Links
    $hasChildren = in_array('menu-item-has-children', $item->classes, true);

    $attrs_ = [
      'href'          => $item->url,
      'id'            => $hasChildren ? '_site-nav_sub' . ++$this->sub . $this->parentName : '',
      'target'        => $item->target,
      'title'         => $item->attr_title,
      'rel'           => $item->type_label === 'Front Page' ? 'start' : $item->xfn,
      'aria-current'  => (string) $item->current // TODO
    ];
    
    $attrs = [];
    foreach ($attrs_ as $key => $value) {
      if (empty($value)) {
        continue;
      }

      if ($key === 'href') {
        $value = esc_url($value);
      } else {
        $value = esc_attr($value);
      }

      $attrs[] = $key . '="' . $value . '"';
    }

    $output .= '<a ' . join(' ', $attrs) . ' ' . ($depth > 0 ? 'tabindex="-1"' : '') . '>' . $item->title;
    
    if (pprek24_is_external_link($item->url)) {
      global $pprek24_external_link_tag;
      $output .= ' ' . $pprek24_external_link_tag;
    }

    $output .= '</a>';
  }

  public function end_el (&$output, $data_object, $depth = 0, $args = null): void {
    $output .= '</li>';
  }

  public function end_lvl (&$output, $depth = 0, $args = null): void {
    $output .= '</ul>';
  }
}
