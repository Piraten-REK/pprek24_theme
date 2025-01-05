<article <?php post_class('card card-post'); ?>>
  <header>
    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
  </header>
  <p class="card-excerpt"><?php echo wp_strip_all_tags(get_the_excerpt()); ?></p>
  <footer>
    <div class="card-foot-date">
      <i role="img" aria-hidden="true" class="bi bi-calendar-event" title="<?php esc_attr_e('Veröffentlichungsdatum', 'pprek24'); ?>"></i>
      <span class="sr-only"><?php esc_html_e('Veröffentlicht am', 'pprek24'); ?></span>
      <a href="<?php echo esc_url(pprek24_get_day_archive()); ?>" title="<?php Pprek24DateFormat::display_formatted_date('pp_medium', 'attr'); ?>">
        <time datetime="<?php the_date('c'); ?>"><?php Pprek24DateFormat::display_formatted_date('pp_short', 'html'); ?></time>
      </a>
    </div>
    <?php if (has_term('', 'municipality')): ?><div class="card-foot-municipality">
      <i role="img" aria-hidden="true" class="bi bi-geo" title="<?php esc_attr_e('Kommunen', 'pprek24'); ?>"></i>
      <span class="sr-only"><?php esc_html_e('Kommunen', 'pprek24'); ?></span>
      <ul>
        <?php foreach (get_the_terms(get_the_ID(), 'municipality') as $municipality): ?><li>
          <a href="<?php echo get_tag_link($municipality->term_id); ?>" title="<?php $meta = get_term_meta($municipality->term_id, 'municipality_data', true); echo esc_attr($meta['long_title'] ?? $municipality->name); ?>">
            <?php echo esc_html($municipality->name); ?>
          </a>
        </li><?php endforeach; ?>
      </ul>
    </div><?php endif; ?>
    <div class="card-foot-cats">
      <i role="img" aria-hidden="true" class="bi bi-tags" title="<?php esc_attr_e('Kategorien', 'pprek24'); ?>"></i>
      <span class="sr-only"><?php esc_html_e('Kategorien','pprek24') ?></span>
      <ul>
        <?php foreach (wp_get_post_categories(get_the_ID(), ['fields' => 'all']) as $cat): ?><li>
          <a href="<?php echo get_category_link($cat); ?>" title="<?php echo esc_attr($cat->name); ?>">
            <?php echo esc_html($cat->name); ?>
          </a>
        </li><?php endforeach; ?>
      </ul>
    </div>
  </footer>
  <?php if(has_post_thumbnail()): ?><img class="card-img" src="<?php the_post_thumbnail_url(); ?>" alt="<?php the_post_thumbnail_caption(); ?>" aria-hidden="true" style="<?php echo pprek24_get_post_thumbnail_meta_css(3 / 2); ?>">
  <?php else: ?><div role="img" aria-hidden="true" class="card-img default-img"></div><?php endif; ?>
</article>