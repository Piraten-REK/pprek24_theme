<?php
$type = 'unknown';
if (isset($_GET['id'])) {
  if (!empty($_GET['id']) && !empty($_GET['start'])) {
    $type = 'event';
  } else {
    $type = 'broken_event';
  }
} else {
  $type = 'month';
}

get_header();

if ($type == 'month'): ?>
  <h1>Unsere Termine</h1>
  <div data-pprek-calendar="month" data-pprek-year="<?php echo esc_attr($_GET['year'] ?? ''); ?>" data-pprek-month="<?php echo esc_attr($_GET['month'] ?? ''); ?>"></div>
<?php else: ?>
  KALENDER
<?php endif; get_footer(); ?>

