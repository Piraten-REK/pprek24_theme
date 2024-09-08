<?php

function pprek24_setup_theme () {
  add_theme_support('post_thumbnails');
  add_theme_support('automatic-feed-links');
  add_theme_support('title-tag');
  add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);

  register_nav_menu( 'primary', __('Hauptmenü', 'pprek24') );
	register_nav_menu( 'footer_social', __('Social Links', 'pprek24') );
	register_nav_menu( 'footer_links_1', __('Footer Links 1', 'pprek24') );
  register_nav_menu( 'footer_links_2', __('Footer Links 2', 'pprek24') );
  register_nav_menu( 'legal_links', __('Rechtliche Links', 'pprek24') );
}