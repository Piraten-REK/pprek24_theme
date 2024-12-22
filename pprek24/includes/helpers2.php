<?php

function pprek24_get_shortlink (string $shortlink, int $id, string $context, bool $allow_slugs): string {
  $shortbase = pprek24_shortlink();

  if (is_null($shortbase)) {
    return $shortlink;
  } else {
    $baseurl = get_bloginfo('wpurl');
    return str_replace($baseurl, $shortbase, $shortlink);
  }
}

define('PPREK24_SHORT_DATE_FORMATTER', new IntlDateFormatter(
  get_locale(),
  IntlDateFormatter::SHORT,
  IntlDateFormatter::NONE,
  null,
  IntlDateFormatter::GREGORIAN
));

define('PPREK24_MEDIUM_DATE_FORMATTER', new IntlDateFormatter(
  get_locale(),
  IntlDateFormatter::MEDIUM,
  IntlDateFormatter::NONE,
  null,
  IntlDateFormatter::GREGORIAN
));

define('PPREK24_FULL_DATE_FORMATTER', new IntlDateFormatter(
  get_locale(),
  IntlDateFormatter::FULL,
  IntlDateFormatter::NONE,
  null,
  IntlDateFormatter::GREGORIAN
));

define('PPREK24_PP_SHORT_DATE_FORMATTER', new IntlDateFormatter(
  get_locale(),
  IntlDateFormatter::NONE,
  IntlDateFormatter::NONE,
  null,
  IntlDateFormatter::GREGORIAN,
  'dd. MMM yyyy'
));

define('PPREK24_PP_MEDIUM_DATE_FORMATTER', new IntlDateFormatter(
  get_locale(),
  IntlDateFormatter::NONE,
  IntlDateFormatter::NONE,
  null,
  IntlDateFormatter::GREGORIAN,
  'eeee, d. MMMM yyyy'
));

class Pprek24DateFormat {
  public const SHORT_DATE_FORMATTER = PPREK24_SHORT_DATE_FORMATTER;
  public const MEDIUM_DATE_FORMATTER = PPREK24_MEDIUM_DATE_FORMATTER;
  public const FULL_DATE_FORMATTER = PPREK24_FULL_DATE_FORMATTER;
  public const PP_SHORT_DATE_FORMATTER = PPREK24_PP_SHORT_DATE_FORMATTER;
  public const PP_MEDIUM_DATE_FORMATTER = PPREK24_PP_MEDIUM_DATE_FORMATTER;

  /**
   * Formats the provided date
   * @param 'short' | 'medium' | 'long' | 'pp_short' | 'pp_medium' $format How to format
   * @param int|DateTime|null $date The date to format, if `null` is provided (the default) the response off `get_the_time()` is used
   * @return string
   */
  public static function get_formatted_date(string $format = 'pp_short', int|DateTime|null $date = null): string {
    if (is_null($date)) {
      $date = get_the_time('U');
    }

    return match ($format) {
      'medium' => self::MEDIUM_DATE_FORMATTER->format($date),
      'full' => self::FULL_DATE_FORMATTER->format($date),
      'pp_short' => self::PP_SHORT_DATE_FORMATTER->format($date),
      'pp_medium' => self::PP_MEDIUM_DATE_FORMATTER->format($date),
      default => self::SHORT_DATE_FORMATTER->format($date),
    };
  }

  /**
   * Prints the formatted date
   * @param 'short' | 'medium' | 'long' | 'pp_short' | 'pp_medium' $format How to format
   * @param 'html' | 'attr' | null $esc If and how to escape the date
   * @param int|DateTime|null $date The date to format, if `null` is provided (the default) the response off `get_the_time()` is used
   * @return void
   */
  public static function display_formatted_date(string $format = 'pp_short', string | null $esc = null, int|DateTime|null $date = null): void {
    $str = self::get_formatted_date($format, $date);

    print(match ($esc) {
      'html' => esc_html($str),
      'attr' => esc_attr($str),
      default => $str,
    });
  }
}

function pprek24_get_day_archive (WP_Post|int|null $post = null): string {
  $year = intval(get_the_time('Y', $post));
  $month = intval(get_the_time('m', $post));
  $day = intval(get_the_time('d', $post));

  return get_day_link($year, $month, $day);
}

define('PPREK24_JAVASCRIPT_CONFIGURATION', [
  'calendar_api_url'  =>  pprek24_calendar_api_url(),
  'calendar_page'     =>  pprek24_calendar_page_url('', 'relative')
]);

function pprek24_modify_page_title (array $title_parts): array {
  if (str_ends_with(get_page_template(), 'page-calendar.php')) {
    if (!empty($_GET['title'])) {
      $title_parts['title'] = $_GET['title'];
    } else {
      $title_parts['title'] = 'Unsere Termine';
    }
  }

  return $title_parts;
}
