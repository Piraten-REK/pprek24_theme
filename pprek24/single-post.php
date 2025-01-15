<?php get_header(); ?>
<header>
  <?php if (has_post_thumbnail()) the_post_thumbnail(); ?>
  <h1><?php the_title(); ?></h1>
  <div role="complementary" aria-roledescription="<?php esc_attr_e('Metainformationen des aktuellen Blogposts', 'pprek24'); ?>">
    <div class="categories">
      <i class="bi bi-bookmarks" role="img" title="<?php esc_attr_e('Kategorien', 'pprek24'); ?>"></i>
      <ul><?php foreach (wp_get_post_categories(get_the_ID(), ['fields' => 'all']) as $category): ?>
        <li>
          <a href="<?php echo get_category_link($category); ?>" title="<?php echo esc_attr(sprintf('%s „%s“%s', __('Kategorie', 'pprek24'), $category->name, empty($category->description) ? '' : "\n\n" . strip_tags($category->description))); ?>">
            <?php echo esc_html($category->name); ?>
          </a>
        </li>
      <?php endforeach; ?></endforeach></ul>
    </div>
    <?php if (has_tag()): ?><div class="tags">
      <i class="bi bi-tags" role="img" title="<?php esc_attr_e('Themen', 'pprek24'); ?>"></i>
      <ul><?php foreach (wp_get_post_tags(get_the_ID()) as $tag): ?>
        <li>
          <a href="<?php echo get_tag_link($tag->term_id); ?>" title="<?php echo esc_attr(sprintf('%s „%s“%s', __('Thema', 'pprek24'), $tag->name, empty($tag->description) ? '' : "\n\n" . strip_tags($tag->description))); ?>">
            <?php echo esc_html($tag->name); ?>
          </a>
        </li>
      <?php endforeach; ?></ul>
    </div><?php endif; ?>
    <?php if (has_term('', 'municipality')): ?><div class="municipalities">
      <i class="bi bi-houses" role="img" title="<?php esc_attr_e('Kommunen', 'pprek24'); ?>'"></i>
      <ul><?php foreach (get_the_terms(get_the_ID(), 'municipality') as $tag):
          $meta = get_term_meta($tag->term_id, 'municipality_data', true); ?>
        <li>
          <a href="<?php echo get_tag_link($tag->term_id); ?>" title="<?php echo esc_attr(sprintf('%s%s', $meta['long_title'] ?? __('Kommune', 'pprek24') . ' „' . $tag->name . '“', empty($tag->description) ? '' : "\n\n" . strip_tags($tag->description))); ?>">
            <?php echo esc_html($tag->name); ?>
          </a>
        </li>
      <?php endforeach; ?></ul>
    </div><?php endif; ?>
    <div class="publication_date">
      <i class="bi bi-calendar-event" role="img" title="<?php esc_attr_e('Veröffentlichungsdatum', 'pprek24'); ?>"></i>
      <time datetime="<?php the_date('Y-m-d'); ?>"><?php Pprek24DateFormat::display_formatted_date('full', 'html', get_the_date('U')); ?></time>
    </div>
  </div>
</header>
<section class="post-content full-width layout-inherit">
  <?php the_content(); ?>
</section>

<?php get_footer();