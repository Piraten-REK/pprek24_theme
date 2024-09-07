<?php

function pprek24_page_autor (string $default = 'PIRATEN Rhein-Erft-Kreis'): string {
  return is_singular()
    ? get_the_author()
    : $default;
}

function pprek24_get_description (): string {
  return get_bloginfo('description');
}

function pprek24_get_nav_menu_for_location (string $location): WP_Term | null {
  $locations = get_nav_menu_locations();

  if (!in_array($location, array_keys($locations))) {
    throw new ErrorException("$location is not a valid location");
  }

  if (!isset($locations[$location])) {
    return null;
  }

  $id = $locations[$location];

  return wp_get_nav_menu_object($id);
}

function pprek24_is_external_link (string $href): bool {
  $self = preg_replace('/^https?:\/\//', '', get_bloginfo('url'));

  return !(
    str_starts_with($href, '#') ||
    preg_match('/^\/(?!\/)/', $href) ||
    str_starts_with($href, '//' . $self) ||
    str_starts_with($href, 'http://' . $self) ||
    str_starts_with($href, 'https://' . $self)
  );
}

define('PPREK24_EXTERNAL_LINK_TAG', '<i aria-hidden="true" class="bi bi-box-arrow-up-right external-link-marker" title="' . esc_attr('Externer Link', 'pprek24') . '"></i>');
