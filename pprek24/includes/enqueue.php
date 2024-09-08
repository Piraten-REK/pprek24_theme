<?php

function pprek24_enqueue (): callable {
  $uri = get_theme_file_uri();
  $ver = PPREK_DEV_MODE ? time(): false;

  $styles = [
    'main'  => '/assets/styles/app.css'
  ];
  $scripts = [
    'main_js' => '/assets/js/app.js'
  ];

  global $pprek24_enqueued_styles;
  if (!isset($pprek24_enqueued_styles)) {
    $pprek24_enqueued_styles = array();
  }

  foreach (array_merge($styles, $scripts) as $handle => $src) {
    $url = $src;

    if (false !== $ver) {
      $url .= '?ver=' . $ver;
    }

    $pprek24_enqueued_styles[$handle] = $url;
  }

  return function () use ($styles, $scripts, $uri, $ver): void {
    foreach ($styles as $handle => $src) {
      wp_register_style("pprek24_$handle", $uri . $src, [], $ver);
      wp_enqueue_style("pprek24_$handle");
    }

    foreach ($scripts as $handle => $src) {
      wp_register_script("pprek24_$handle", $uri . $src, [], $ver, [ 'strategy' => 'defer' ]);
      wp_enqueue_script("pprek24_$handle");
    }
  };
}
