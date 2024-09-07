<?php

// Setup
define('PPREK_DEV_MODE', true);

// INCLUDES
$includes = [
  'helpers',
  'setup',
  'pprek-nav-walker',
  'primary-nav-walker',
  'social-nav-walker',
  'enqueue'
];

foreach ($includes as $include) {
  include(get_theme_file_path("/includes/$include.php"));
}

// Hooks
add_action('after_setup_theme', 'pprek24_setup_theme');
add_action('wp_enqueue_scripts', 'pprek24_enqueue');