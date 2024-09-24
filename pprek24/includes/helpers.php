<?php

function pprek24_get_description (): string {
  return get_bloginfo('description');
}

function pprek24_get_nav_menu_for_location (string $location): WP_Term | null {
  $locations = get_nav_menu_locations();

  if (!in_array($location, array_keys($locations))) {
    return null;
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

global $pprek24_external_link_tag;
$pprek24_external_link_tag = '<i aria-hidden="true" class="bi bi-box-arrow-up-right external-link-marker" title="' . esc_attr__('Externer Link', 'pprek24') . '"></i>';

function pprek24_preload_styles (): void {
  global $pprek24_enqueued_styles;

  $mapped = [];
  foreach ($pprek24_enqueued_styles as $url) {
    if (!str_ends_with(preg_replace('/\?[^\/]+$/', '', $url), '.css')) {
      continue;
    }

    printf('<link rel="preload" href="%s" as="style">', get_theme_file_uri($url));
  }
}

function pprek24_preload_scripts (): void {
  global $pprek24_enqueued_styles;

  $mapped = [];
  foreach ($pprek24_enqueued_styles as $url) {
    if (!str_ends_with(preg_replace('/\?[^\/]+$/', '', $url), '.js')) {
      continue;
    }

    printf('<link rel="preload" href="%s" as="script">', get_theme_file_uri($url));
  }
}
