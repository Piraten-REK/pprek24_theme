  </main>
  <footer class="site-footer">
    <div class="site-footer_top">
      <?php
        if (has_nav_menu('footer_social')) {
          wp_nav_menu([
            'theme_location'        => 'footer_social',
            'container'             => '',
            'container_class'       => '',
            'container_id'          => '',
            'menu_class'            => 'site-footer_social',
            'menu_id'               => '',
            'fallback_cb'           => false,
            'depth'                 => 1,
            'walker'                => new Pprek24_SocialNavWalker(),
            'items_wrap'            => '<ul class="%2$s" aria-label="' .
              pprek24_get_nav_menu_for_location('footer_social')->name .
              '">%3$s</ul>'
            ]);
        }
      ?>
      <ul aria-label="<?php esc_attr_e('Social Media', 'pprek24'); ?>" class="site-footer_social">
        <!-- TODO -->
      </ul>

      <div class="site-footer_links">
        <?php
          if (has_nav_menu('footer_links_1')) {
            wp_nav_menu([
              'theme_location'        => 'footer_links_1',
              'container'             => 'div',
              'container_class'       => 'site-footer_links-1',
              'container_id'          => '',
              'menu_class'            => '',
              'menu_id'               => '',
              'fallback_cb'           => false,
              'depth'                 => 1,
              'walker'                => new Pprek24_NavWalker(),
              'items_wrap'            => '<h2 id="_footer_links-1">' .
                pprek24_get_nav_menu_for_location('footer_links_1')->name .
                '</h2><ul aria-labelledby="_footer-links-1">%3$s</ul>'
            ]);
          }

          if (has_nav_menu('footer_links_2')) {
            wp_nav_menu([
              'theme_location'        => 'footer_links_2',
              'container'             => 'div',
              'container_class'       => 'site-footer_links-2',
              'container_id'          => '',
              'menu_class'            => '',
              'menu_id'               => '',
              'fallback_cb'           => false,
              'depth'                 => 1,
              'walker'                => new Pprek24_NavWalker(),
              'items_wrap'            => '<h2 id="_footer_links-2">' .
                pprek24_get_nav_menu_for_location('footer_links_2')->name .
                '</h2><ul aria-labelledby="_footer-links-2">%3$s</ul>'
            ]);
          }
        ?>
      </div>
    </div>
    <div class="site-footer_bottom">
      <p id="_copyright" class="site-footer_copyright"><span class="nobr">&copy; <?php echo date('Y'); ?></span> PIRATEN Rhein-Erft-Kreis</p>
      <div id="_license" class="site-footer_license" style="--_icon-count: 2;">
        <a class="site-footer_license-icons no-ext-icon" href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="license noopener noreferrer" aria-labelledby="_license">
          <svg viewBox="0 0 30 30"><use href="<?php echo get_theme_file_uri('/assets/img/cc-icons.svg#cc-logo') ?>"></use></svg>
          <svg viewBox="0 0 30 30"><use href="<?php echo get_theme_file_uri('/assets/img/cc-icons.svg#cc-by') ?>"></use></svg>
        </a>
        <p id="_license" xmlns:cc="http://creativecommons.org/ns#">Die Inhalte dieser Seite sind, soweit nicht anders gekennzeichnet, lizensiert unter einer <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY 4.0 Lizenz</a>.</p>
      </div>
  
      <?php
        if (has_nav_menu('legal_links')) {
          wp_nav_menu([
            'theme_location'        => 'legal_links',
            'container'             => '',
            'container_class'       => '',
            'container_id'          => '',
            'menu_class'            => 'site-footer_legal',
            'menu_id'               => '',
            'fallback_cb'           => false,
            'depth'                 => 1,
            'walker'                => new Pprek24_NavWalker(),
            'items_wrap'            => '<ul class="%2$s">%3$s</ul>'
          ]);
        }
      ?>
    </div>
  </footer>
  <?php wp_footer(); ?>
</html>
