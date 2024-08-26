<?php

// Setup
define('PPREK_DEV_MODE', true);

// INCLUDES
$includes = [];

foreach ($includes as $include) {
  include(get_theme_file_path("/includes/$include.php"));
}

// Hooks
