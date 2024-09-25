<?php

/**
 * @param string[] $query_vars
 * @return string[]
 */
function pprek24_custom_query_vars (array $query_vars): array {
  $query_vars[] = 'webmanifest';
  $query_vars[] = 'browserconfig';
  return $query_vars;
}

function pprek24_template_redirect(): void {
  if (get_query_var('webmanifest')) {
    include get_template_directory() . '/templates/webmanifest.php';
    exit;
  }

  if (get_query_var('browserconfig')) {
    include get_template_directory() . '/templates/browserconfig.php';
    exit;
  }
}
