<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- PRELOADS -->
  <!-- FAVICON -->
  <meta name="referrer" content="same-origin">
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="hsl(21 98% 40%)">
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="hsl(32 100% 50%)">
  <meta name="color-scheme" content="light dark">
  <meta name="author" content="<?php echo pprek24_page_author(); ?>">
  <meta name="description" content="<?php echo pprek24_get_description(); ?>">
  <meta name="keywords" content="PIRATEN,Piratenpartei,Rhein,Erft,Rhein-Erft,Rhein-Erft-Kreis,Erftkreis,Politk,orange,Digitalpolitik,Netzpolitk,Zukunft,Kreistag,Bedburg,Bergheim,Brühl,Erftstadt,Elsdorf,Frechen,Kerpen,Pulheim"> <!-- TODO-->
  <meta name="creator" content="PIRATEN Rhein-Erft-Kreis"> <!-- TODO -->
  <meta name="publisher" content="PIRATEN Rhein-Erft-Kreis"> <!-- TODO -->
  <!-- OGP -->
  <!-- TWITTER -->
  <link rel="canonical" href="<?php echo get_bloginfo('url'); ?>">
  <link rel="shortlink" href="https://piraten-rek.de"> <!-- TODO -->
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