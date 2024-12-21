<?php
$type = 'unknown';
if (isset($_GET['id'])) {
  if (!empty($_GET['id']) && !empty($_GET['start'])) {
    $type = 'event';
  } else {
    $type = 'broken_event';
  }
} elseif (isset($_GET['year']) && isset($_GET['month'])) {
  $type = 'month';
}

get_header();

if ($type == 'month'): ?>
<h1>Unsere Termine</h1>
<div data-pprek-calendar="month" data-pprek-year="<?php echo esc_attr($_GET['year']); ?>" data-pprek-month="<?php echo esc_attr($_GET['month']); ?>">PLACEHOLDER</div>
<?php else: ?>
KALENDER
<?php endif; get_footer(); ?>
