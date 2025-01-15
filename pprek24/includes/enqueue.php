<?php

function pprek24_enqueue (): callable {
  $uri = get_theme_file_uri();
  $ver = PPREK_DEV_MODE ? time() : false;

  $styles = [
    'main'    =>  '/assets/styles/app.css',
    'print'   =>  ['/assets/styles/print.css', 'media' => 'print'],
    '404'     =>  ['/assets/styles/404.css', 'condition' => fn () => is_404()],
    'home'    =>  ['/assets/styles/home.css', 'condition' => fn () => is_front_page()],
    'post'    =>  ['/assets/styles/post.css', 'condition' => fn () => is_singular('post')],
  ];
  $scripts = [
    'main_js' =>  '/assets/js/app.js',
    'post_js' =>  ['/assets/js/post.js', 'condition' => fn () => is_singular('post')],
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
    $media = is_array($src) && array_key_exists('media', $src) ? $src['media'] : null;
    /** @var bool $enqueue */
    $enqueue = is_array($src) && array_key_exists('condition', $src)
      ? is_callable($src['condition'])
        ? $src['condition']()
        : $src['condition']
      : true;

    if (!$enqueue || (!is_null($media) && $media !== 'all' && $media !== 'screen')) {
      continue;
    }

    if (false !== $ver) {
      $url .= '?ver=' . $ver;
    }

    $pprek24_enqueued_styles[$handle] = $url;
  }

  foreach ($scripts as $handle => $src) {
    $url = $src;

    $enqueue = is_array($src) && array_key_exists('condition', $src)
      ? is_callable($src['condition'])
        ? $src['condition']()
        : $src['condition']
      : true;

    if (!$enqueue) {
      continue;
    }

    if (false !== $ver) {
      $url .= '?ver=' . $ver;
    }

    $pprek24_enqueued_scripts[$handle] = $url;
  }

  return function () use ($styles, $scripts, $uri, $ver): void {
    foreach ($styles as $handle => $src) {
      $url = is_array($src) ? $src[0] : $src;
      $media = is_array($src) && array_key_exists('media', $src) ? $src['media'] : null;
      /** @var bool $enqueue */
      $enqueue = is_array($src) && array_key_exists('condition', $src)
        ? is_callable($src['condition'])
          ? $src['condition']()
          : $src['condition']
        : true;

      if (!$enqueue) {
        continue;
      }

      wp_register_style("pprek24_$handle", $uri . $url, [], $ver, $media ?? 'all');
      wp_enqueue_style("pprek24_$handle");
    }

    foreach ($scripts as $handle => $src) {
      $url = is_array($src) ? $src[0] : $src;
      $enqueue = is_array($src) && array_key_exists('condition', $src)
        ? is_callable($src['condition'])
          ? $src['condition']()
          : $src['condition']
        : true;

      if (!$enqueue) {
        continue;
      }
      
      wp_register_script("pprek24_$handle", $uri . $url, [], $ver, [ 'strategy' => 'defer' ]);
      wp_enqueue_script("pprek24_$handle");
    }
  };
}

function pprek24_enqueue_gutenberg_assets(): void {
  $ver = PPREK_DEV_MODE ? time() : false;

  wp_enqueue_style(
    'pprek24-block-editor-styles',
    get_theme_file_uri('/assets/styles/block-editor.css'),
    [],
    $ver
  );

  $assets_directory = get_theme_file_path('/assets/js/gutenberg');

  foreach (new DirectoryIterator($assets_directory) as $file) {
    if ($file->isDot() || !str_ends_with($file->getFilename(), '.asset.php')) {
      continue;
    }

    $name = substr($file->getFilename(), 0, -10);
    $asset = require($file->getPathname());

    wp_enqueue_script(
      "pprek24_gutenberg_$name",
      get_theme_file_uri("/assets/js/gutenberg/$name.js"),
      $asset['dependencies'],
      $asset['version'],
      true
    );
  }
}
