<?php

function pprek24_enqueue (): callable {
  $uri = get_theme_file_uri();
  $ver = PPREK_DEV_MODE ? time(): false;

  $styles = [
    'main'  =>  '/assets/styles/app.css',
    'print' =>  ['/assets/styles/print.css', 'print'],
  ];
  $scripts = [
    'main_js' =>  '/assets/js/app.js'
  ];

  global $pprek24_enqueued_styles;
  if (!isset($pprek24_enqueued_styles)) {
    $pprek24_enqueued_styles = array();
  }
  global $pprek24_enqueued_scripts;
  if (!isset($pprek24_enqueued_scripts)) {
    $pprek24_enqueued_scripts = array();
  }

  foreach ($styles as $handle => $src) {
    $url = is_array($src) ? $src[0] : $src;
    $media = is_array($src) && sizeof($src) > 1 ? $src[1] : null;

    if (!is_null($media) && $media !== 'all' && $media !== 'screen') {
      continue;
    }

    if (false !== $ver) {
      $url .= '?ver=' . $ver;
    }

    $pprek24_enqueued_styles[$handle] = $url;
  }

  foreach ($scripts as $handle => $src) {
    $url = $src;

    if (false !== $ver) {
      $url .= '?ver=' . $ver;
    }

    $pprek24_enqueued_scripts[$handle] = $url;
  }

  return function () use ($styles, $scripts, $uri, $ver): void {
    foreach ($styles as $handle => $src) {
      $url = is_array($src) ? $src[0] : $src;
      $media = is_array($src) && sizeof($src) > 1 ? $src[1] : null;
      wp_register_style("pprek24_$handle", $uri . $url, [], $ver, $media ?? 'all');
      wp_enqueue_style("pprek24_$handle");
    }

    foreach ($scripts as $handle => $src) {
      wp_register_script("pprek24_$handle", $uri . $src, [], $ver, [ 'strategy' => 'defer' ]);
      wp_enqueue_script("pprek24_$handle");
    }
  };
}
