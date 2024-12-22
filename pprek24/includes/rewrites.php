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

function pprek24_template_include(string $template): string {
  $current_url = $_SERVER['REQUEST_URI'];

  if (str_contains($current_url, pprek24_calendar_page_url('', 'relative'))) {
    $new_template = locate_template('/templates/calendar.php');

    if ('' != $new_template) {
      http_response_code(200);
      return $new_template;
    }
  }

  return $template;
}
