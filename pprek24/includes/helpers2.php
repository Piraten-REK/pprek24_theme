<?php

function pprek24_get_shortlink (string $shortlink, int $id, string $context, bool $allow_slugs): string {
  $shortbase = pprek24_shortlink();

  if (is_null($shortbase)) {
    return $shortlink;
  } else {
    $baseurl = get_bloginfo('wpurl');
    return str_replace($baseurl, $shortbase, $shortlink);
  }
}
