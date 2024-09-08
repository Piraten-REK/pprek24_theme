<button class="site-nav-toggle" title="Navigation öffnen" aria-controls="_site-nav" aria-expanded="false">
  <svg viewBox="0 0 32 32">
    <rect />
    <rect />
    <rect />
  </svg>
</button>
<?php
  if (has_nav_menu('primary')) {
    wp_nav_menu([
      'theme_location'        => 'primary',
      'container'             => 'nav',
      'container_class'       => 'site-nav',
      'container_id'          => '_site-nav',
      'container_aria_label'  => __('Hauptnavigation', 'pprek24'),
      'fallback_cb'           => false,
      'depth'                 => 2,
      'walker'                => new Pprek24_PrimaryNavWalker(),
      'items_wrap'            => '<ul>%3$s</ul>'
    ]);
  }
?>