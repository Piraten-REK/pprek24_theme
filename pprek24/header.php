<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preload" href="<?php echo get_theme_file_uri('/assets/fonts/mulish.woff2') ?>" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="<?php echo get_theme_file_uri('/assets/fonts/mulish_italic.woff2') ?>" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="<?php echo get_theme_file_uri('/assets/fonts/bootstrap-icons.woff2') ?>" as="font" type="font/woff2" crossorigin>
  <?php pprek24_preload_styles(); echo "\n"; ?>
  <?php pprek24_preload_scripts(); echo "\n"; ?>
  <link rel="apple-touch-icon" sizes="180x180" href="<?php pprek24_favicon('apple-touch-icon', true); ?>>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php pprek24_favicon('32', true); ?>">
  <link rel="icon" type="image/png" sizes="16x16" href="<?php pprek24_favicon('16', true); ?>">
  <link rel="manifest" href="/assets/icons/site.webmanifest"> <!-- TODO -->
  <link rel="mask-icon" href="<?php pprek24_favicon('safari_pinned_tab', true); ?>" color="<?php pprek24_favicon('safari_pinned_tab_color', true); ?>">
  <link rel="shortcut icon" href="<?php pprek24_favicon('ico', true); ?>">
  <meta name="msapplication-TileColor" content="<?php pprek24_favicon('msapplication_color', true); ?>">
  <meta name="msapplication-config" content="/assets/icons/browserconfig.xml"> <!-- TODO -->
  <meta name="referrer" content="same-origin">
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="hsl(21 98% 40%)">
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="hsl(32 100% 50%)">
  <meta name="color-scheme" content="light dark">
  <meta name="author" content="<?php echo esc_attr(pprek24_page_author()); ?>">
  <meta name="description" content="<?php echo esc_attr(pprek24_get_description()); ?>">
  <meta name="keywords" content="<?php echo esc_attr(implode(',', pprek24_global_tags())); ?>">
  <meta name="creator" content="<?php echo pprek24_default_author() ?>">
  <meta name="publisher" content="<?php echo pprek24_default_author() ?>">
  <!-- OGP -->
  <!-- TWITTER -->
  <link rel="canonical" href="<?php echo esc_url(get_bloginfo('url')); ?>">
  <?php $shortlink = pprek24_shortlink(); if (!is_null($shortlink)) { ?><link rel="shortlink" href="<?php echo esc_url($shortlink); ?>"><?php echo "\n"; } ?>
  <link rel="home" href="/">
  <link rel="copyright" href="#_copyright">
  <link rel="license" href="#_license">
  <link rel="code-repository" href="https://github.com/piraten-rek/pprek24_theme">
  <link rel="code-license" href="https://github.com/piraten-rek/pprek24_theme/LICENSE">
  <link rel="content-license" href="#_license">
  <link rel="privacy-policy" href="/datenschutz">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <?php get_template_part( 'partials/header' ); ?>
  <main id="main" class="layout">