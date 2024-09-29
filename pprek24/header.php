<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preload" href="<?php echo get_theme_file_uri('/assets/fonts/mulish.woff2') ?>" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="<?php echo get_theme_file_uri('/assets/fonts/mulish_italic.woff2') ?>" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="<?php echo get_theme_file_uri('/assets/fonts/bootstrap-icons.woff2') ?>" as="font" type="font/woff2" crossorigin>
  <?php pprek24_preload_styles(); echo "\n"; ?>
  <?php pprek24_preload_scripts(); echo "\n"; ?>
  <link rel="apple-touch-icon" sizes="180x180" href="<?php pprek24_favicon('apple-touch-icon', true); ?>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php pprek24_favicon('32', true); ?>">
  <link rel="icon" type="image/png" sizes="16x16" href="<?php pprek24_favicon('16', true); ?>">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="<?php pprek24_favicon('safari_pinned_tab', true); ?>" color="<?php pprek24_favicon('safari_pinned_tab_color', true); ?>">
  <link rel="shortcut icon" href="<?php pprek24_favicon('ico', true); ?>">
  <meta name="msapplication-TileColor" content="<?php pprek24_favicon('msapplication_color', true); ?>">
  <meta name="msapplication-config" content="/browserconfig.xml">
  <meta name="referrer" content="same-origin">
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="hsl(21 98% 40%)">
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="hsl(32 100% 50%)">
  <meta name="color-scheme" content="light dark">
  <meta name="author" content="<?php echo esc_attr(pprek24_page_author()); ?>">
  <meta name="description" content="<?php echo esc_attr(pprek24_get_description()); ?>">
  <meta name="keywords" content="<?php echo esc_attr(implode(',', pprek24_global_tags())); ?>">
  <meta name="creator" content="<?php echo esc_attr(pprek24_default_author()); ?>">
  <meta name="publisher" content="<?php echo esc_attr(pprek24_default_author()); ?>">
  <meta property="og:title" content="<?php echo esc_attr(get_the_title()); ?>">
  <meta property="og:type" content="<?php echo is_single() ? 'article' : (is_author() ? 'profile' : 'website'); ?>">
  <?php $ogp_image = pprek24_ogp_default_social_img(); ?><meta property="og:image" content="<?php echo preg_replace('/^https:\/\//', 'http://', esc_url($ogp_image[0])); ?>">
  <meta property="og:image:secure_url" content="<?php echo preg_replace('/^http:\/\//', 'https://', esc_url($ogp_image[0])); ?>">
  <meta property="og:image:type" content="<?php echo esc_attr($ogp_image[3]); ?>">
  <meta property="og:image:width" content="<?php echo esc_attr($ogp_image[1]); ?>">
  <meta property="og:image:height" content="<?php echo esc_attr($ogp_image[2]); ?>">
  <meta property="og:image:alt" content="<?php esc_attr(the_title()); ?>">
  <meta property="og:url" content="<?php echo esc_url(wp_get_shortlink()); ?>">
  <?php if (is_front_page()) { ?><meta property="og:description" content="<?php echo esc_attr(get_bloginfo('description')); ?>"><?php } ?> <!-- TODO -->
  <meta property="og:locale" content="de-DE">
  <meta property="og:site_name" content="<?php echo esc_attr(get_bloginfo('title')); ?>">

  <!-- TWITTER -->
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