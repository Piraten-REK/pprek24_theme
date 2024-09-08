<?php

function pprek24_enqueue (): void {
  $uri = get_theme_file_uri();
  $ver = PPREK_DEV_MODE ? time(): false;

  wp_register_style('pprek24_main', $uri . '/assets/styles/app.css', [], $ver);
  wp_enqueue_style('pprek24_main');

  wp_register_script('pprek24_main_js', $uri . '/assets/js/app.js', [], $ver, [ 'strategy' => 'defer' ]);
  wp_enqueue_script('pprek24_main_js');
}
