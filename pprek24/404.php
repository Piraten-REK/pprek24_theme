<?php get_header(); ?>
<h1 id="title-404" class="sr-only">404 – Not Found</h1>
<figure>
  <img src="https://http.cat/404" alt="404 Not Found" aria-describedby="title-404">
  <figcaption><a class="link" href="https://http.cat/status/404">http.cat <?php global $pprek24_external_link_tag; echo $pprek24_external_link_tag; ?></a></figcaption>
</figure>
<p><?php echo sprintf(_x('%s jibbet hier nich!', '404 page description', 'pprek24'), '<code>' . esc_html(explode('?', $_SERVER['REQUEST_URI'])[0]) . '</code>'); ?></p>
<a class="btn" href="javascript:window.history.back()" title="<?php esc_attr_e('Zur vorherigen Seite zurückkehren', 'pprek24'); ?>"><i aria-hidden="true" class="bi bi-arrow-left"></i> <?php _e('Zurück', 'pprek24'); ?></a>
<?php get_footer(); ?>