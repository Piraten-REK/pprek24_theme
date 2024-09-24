<?php

function pprek24_rewrites(): void {
  if (str_starts_with($_SERVER["REQUEST_URI"], get_theme_file_uri('/assets/icons/site.webmanifest'))) {
    header('Content-Type: application/json');
    echo pprek24_favicon('webmanifest');
    exit;
  }
  if (str_starts_with($_SERVER["REQUEST_URI"], get_theme_file_uri('/assets/icons/browserconfig.xml'))) {
    header('Content-Type: application/xml');
    echo pprek24_favicon('msapplication_config');
    exit;
  }
}
