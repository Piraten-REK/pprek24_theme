<?php

// Setup
const PPREK_DEV_MODE = true;

// INCLUDES
$includes = [
  'helpers',
  'setup',
  'pprek-nav-walker',
  'primary-nav-walker',
  'social-nav-walker',
  'theme-customizer',
  'enqueue',
  'rewrites',
  'helpers2'
];

foreach ($includes as $include) {
  include(get_theme_file_path("/includes/$include.php"));
}

// Hooks
add_action('init', 'pprek24_init');
add_action('after_setup_theme', 'pprek24_setup_theme');
add_action('customize_register', 'pprek24_customize_register');
add_action('wp_enqueue_scripts', pprek24_enqueue());
add_action('template_redirect', 'pprek24_template_redirect');

add_filter('query_vars', 'pprek24_custom_query_vars');
add_filter('site_icon_meta_tags', 'pprek24_site_icon_meta_tags', 10, 1);
add_filter('get_shortlink', 'pprek24_get_shortlink', 10, 4);