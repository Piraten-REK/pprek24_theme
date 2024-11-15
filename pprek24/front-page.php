<?php get_header(); ?>
<section class="homepage_cta"></section>
<section class="homepage_posts">
  <h1><?php esc_html_e('Neuigkeiten', 'pprek24'); ?></h1>
  <div class="homepage_posts_wrapper"><?php $posts = new WP_Query(['posts_per_page' => 8]); ?>
    <?php while ($posts->have_posts()) : $posts->the_post(); get_template_part('partials/card', 'post'); endwhile; ?>
  </div>
</section>
<?php get_footer(); ?>