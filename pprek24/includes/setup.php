<?php

function pprek24_init (): void {
  add_rewrite_rule('^site.webmanifest/?', 'index.php?webmanifest=1', 'top');
  add_rewrite_rule('^browserconfig.xml/?', 'index.php?browserconfig=1', 'top');

  pprek24_create_bylaws_post_type();

  /** @var string[] $post_types */
  $post_types = get_post_types('', 'names');

  foreach ($post_types as $post_type) {
    if (post_type_supports($post_type, 'thumbnail')) {
      register_post_meta($post_type, 'pprek24_featured_image_focus_point', [
        'type'          =>  'array',
        'label'         =>  'Featured Image Focus',
        'single'        =>  true,
        'default'       =>  [50.0, 50.0],
        'show_in_rest'  =>  [
          'schema'  =>  [
            'type'      =>  'array',
            'items'     =>  [
              'type'  =>  'number',
              'min'   =>  0,
              'max'   =>  100
            ],
            'minItems'  =>  2,
            'maxItems'  =>  2
          ]
        ]
      ]);
    }
  }
}

function pprek24_setup_theme (): void {
  add_theme_support('post-thumbnails');
  add_theme_support('automatic-feed-links');
  add_theme_support('title-tag');
  add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);

  register_nav_menu( 'primary', __('Hauptmenü', 'pprek24') );
	register_nav_menu( 'footer_social', __('Social Links', 'pprek24') );
	register_nav_menu( 'footer_links_1', __('Footer Links 1', 'pprek24') );
  register_nav_menu( 'footer_links_2', __('Footer Links 2', 'pprek24') );
  register_nav_menu( 'legal_links', __('Rechtliche Links', 'pprek24') );
}