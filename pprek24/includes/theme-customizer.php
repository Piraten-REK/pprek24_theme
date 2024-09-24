<?php

function pprek24_customize_defaults(): array {
  return [
    'shortlink'                       =>  'https://piraten-rek.de',
    'global_tags'                     =>  'PIRATEN,Piratenpartei,Rhein,Erft,Rhein-Erft,Rhein-Erft-Kreis,Erftkreis,Politk,orange,Digitalpolitik,Netzpolitk,Zukunft',
    'default_author'                  =>  'PIRATEN Rhein-Erft-Kreis',
    'favicon_apple_touch_icon'        =>  get_theme_file_uri('assets/icons/apple-touch-icon.png'),
    'favicon_32'                      =>  get_theme_file_uri('/assets/icons/favicon-32x32.png'),
    'favicon_16'                      =>  get_theme_file_uri('/assets/icons/favicon-16x16.png'),
    'webmanifest'                     =>  file_get_contents(get_theme_file_path('/assets/icons/site.webmanifest')),
    'favicon_safari_pinned_tab'       =>  get_theme_file_uri('/assets/icons/safari-pinned-tab.svg'),
    'favicon_safari_pinned_tab_color' =>  '#ff8800',
    'favicon_ico'                     =>  get_theme_file_uri('/assets/icons/favicon.ico'),
    'favicon_msapplication_color'     =>  '#da532c',
    'favicon_msapplication_config'    =>  file_get_contents(get_theme_file_path('/assets/icons/browserconfig.xml'))
  ];
}

function pprek24_customize_register(WP_Customize_Manager $wp_customize): void {
  $wp_customize->remove_setting('site_icon');

  // Settings
  $wp_customize->add_setting('pprek24_use_shortlink', [
    'default' => false
  ]);
  $wp_customize->add_setting('pprek24_shortlink', [
    'default' => pprek24_customize_defaults()['shortlink']
  ]);
  $wp_customize->add_setting('pprek24_global_tags', [
    'default' => pprek24_customize_defaults()['global_tags']
  ]);
  $wp_customize->add_setting('pprek24_default_author', [
    'default' => pprek24_customize_defaults()['default_author']
  ]);
  $wp_customize->add_setting('pprek24_favicon_apple_touch_icon', [
    'default' => pprek24_customize_defaults()['favicon_apple_touch_icon']
  ]);
  $wp_customize->add_setting('pprek24_favicon_32', [
    'default' => pprek24_customize_defaults()['favicon_32']
  ]);
  $wp_customize->add_setting('pprek24_favicon_16', [
    'default' => pprek24_customize_defaults()['favicon_16']
  ]);
  $wp_customize->add_setting('pprek24_webmanifest', [
    'default' => pprek24_customize_defaults()['webmanifest']
  ]);
  $wp_customize->add_setting('pprek24_favicon_safari_pinned_tab', [
    'default' => pprek24_customize_defaults()['favicon_safari_pinned_tab']
  ]);
  $wp_customize->add_setting('pprek24_favicon_safari_pinned_tab_color', [
    'default' => pprek24_customize_defaults()['favicon_safari_pinned_tab_color']
  ]);
  $wp_customize->add_setting('pprek24_favicon_ico', [
    'default' => pprek24_customize_defaults()['favicon_ico']
  ]);
  $wp_customize->add_setting('pprek24_favicon_msapplication_color', [
    'default' => pprek24_customize_defaults()['favicon_msapplication_color']
  ]);
  $wp_customize->add_setting('pprek24_favicon_msapplication_config', [
    'default' => pprek24_customize_defaults()['favicon_msapplication_config']
  ]);

  // Controllers
  $wp_customize->add_control(new WP_Customize_Control(
    $wp_customize, 'pprek24_use_shortlink', [
      'priority'    => 100,
      'section'     => 'title_tagline',
      'label'       => __('Shortlink verwenden?', 'pprek24'),
      'type'        => 'checkbox'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Control(
    $wp_customize, 'pprek24_shortlink', [
      'priority'    =>  101,
      'section'     =>  'title_tagline',
      'label'       =>  __('Shortlink', 'pprek24'),
      'type'        =>  'url',
      'description' =>  __('Optionaler Shortlink'),
      'input_attrs' => [
        'placeholder' => pprek24_customize_defaults()['shortlink']
      ]
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Control(
    $wp_customize, 'pprek24_global_tags', [
      'priority'    =>  110,
      'section'     =>  'title_tagline',
      'label'       =>  __('Globale Tags', 'pprek24'),
      'type'        =>  'text',
      'description' =>  __('Tags (Metainformationen), welche auf jeder Seite angewandt werden.<br>Kommagetrennte Liste', 'pprek24')
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Control(
    $wp_customize, 'pprek24_default_author', [
      'priority'    =>  120,
      'section'     =>  'title_tagline',
      'label'       =>  __('Standard Author', 'pprek24'),
      'type'        =>  'text',
      'description' =>  __('Wird als Autuor für die gesamte Seite gesetzt und als Autor, wenn keiner ermittelt werden kann oder angezeiogt werden soll.', 'pprek24')
    ]
  ));

  # FAVICON START
  $wp_customize->add_control(new WP_Customize_Cropped_Image_Control(
    $wp_customize, 'pprek24_favicon_apple_touch_icon', [
      'priority'    =>  130,
      'section'     =>  'title_tagline',
      'label'       =>  __('Favicon (Apple Touch Icon)', 'pprek24'),
      'width'       =>  180,
      'height'      =>  180,
      'mime_type'   =>  'image/png'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Cropped_Image_Control(
    $wp_customize, 'pprek24_favicon_32', [
      'priority'    =>  131,
      'section'     =>  'title_tagline',
      'label'       =>  __('Favicon (32x32)', 'pprek24'),
      'width'       =>  32,
      'height'      =>  32,
      'mime_type'   =>  'image/png'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Cropped_Image_Control(
    $wp_customize, 'pprek24_favicon_16', [
      'priority'    =>  132,
      'section'     =>  'title_tagline',
      'label'       =>  __('Favicon (16x16)', 'pprek24'),
      'width'       =>  16,
      'height'      =>  16,
      'mime_type'   =>  'image/png'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Code_Editor_Control(
    $wp_customize, 'pprek24_webmanifest',
    [
      'priority'    =>  133,
      'section'     => 'title_tagline',
      'label'       =>  __('Webmanifest', 'pprek24'),
      'code_type'   => 'application/json'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Image_Control(
    $wp_customize, 'pprek24_favicon_safari_pinned_tab', [
      'priority'    =>  134,
      'section'     => 'title_tagline',
      'label'       =>  __('Favicon (Safari Pinned)', 'pprek24'),
      'mime_type'   =>  'image/svg+xml'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Color_Control(
    $wp_customize, 'pprek24_favicon_safari_pinned_tab_color', [
      'priority'    =>  135,
      'section'     => 'title_tagline',
      'label'       =>  __('Favicon Color (Safari Pinned)', 'pprek24')
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Image_Control(
    $wp_customize, 'pprek24_favicon_safari_pinned_tab_image', [
      'priority'    =>  136,
      'section'     => 'title_tagline',
      'label'       =>  __('Favicon (ICO)', 'pprek24'),
      'mime_type'   =>  'image/x-icon'
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Color_Control(
    $wp_customize, 'pprek24_favicon_msapplication_color', [
      'priority'    =>  137,
      'section'     => 'title_tagline',
      'label'       =>  __('Favicon Color (MSApplication)', 'pprek24')
    ]
  ));
  $wp_customize->add_control(new WP_Customize_Code_Editor_Control(
    $wp_customize, 'pprek24_favicon_msapplication_config', [
      'priority'    =>  138,
      'section'     => 'title_tagline',
      'label'       =>  __('Favicon (MSApplication Config)', 'pprek24'),
      'code_type'   => 'application/xml'
    ]
  ));
}

function pprek24_shortlink(): string | null {
  /** @var bool $show */
  $show = get_theme_mod('pprek24_use_shortlink');
  /** @var string $value */
  $value = get_theme_mod('pprek24_shortlink');

  if(!$show) {
    return null;
  }

  if (is_null($value) || empty(trim($value))) {
    $value = pprek24_customize_defaults()['shortlink'];
  }

  return $value;
}

/**
 * @param string[] $additional
 * @return string[]
 */
function pprek24_global_tags(array $additional = []): array {
  /** @var string $value */
  $value = get_theme_mod('pprek24_global_tags');
  if (is_null($value) || empty(trim($value))) {
    $value = pprek24_customize_defaults()['global_tags'];
  }

  $arr = preg_split('/\s*,\s*/', $value);

  return array_merge($arr, $additional);
}

function pprek24_default_author(): string {
  $value = get_theme_mod('pprek24_default_author');
  if (is_null($value) || empty(trim($value))) {
    return pprek24_customize_defaults()['default_author'];
  }

  return $value;
}

function pprek24_page_author (): string {
  return is_singular() && !is_front_page() && !is_home()
    ? get_the_author() // TODO: Catch if author should be shown
    : pprek24_default_author();
}

function pprek24_get_url_from_attachment(int|WP_Post $post, array $mime_type = []): string {
  /** @var WP_Post|null $value */
  $value = get_post($post, 'OBJECT', 'display');

  if (is_null($value)) {
    throw new ValueError('Post does not exist.');
  }
  if ($value->post_type !== 'attachment') {
    throw new ValueError('Post is not an attachment.');
  }
  foreach ($mime_type as $type) {
    if (!str_starts_with($value->post_mime_type, $type)) {
      throw new RangeException('Post is not a valid mime type.');
    }
  }

  return $value->post_content;
}

function pprek24_favicon(string $type, bool $echo = false): mixed {
  switch ($type) {
    case 'apple-touch-icon':
      $value = get_theme_mod('pprek24_favicon_apple_touch_icon');

      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_apple_touch_icon'];
      } elseif (is_int($value)) {
        $value = pprek24_get_url_from_attachment($value, ['image/']);
      }
      break;

    case '32':
      $value = get_theme_mod('pprek24_favicon_32');
      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_32'];
      } elseif (is_int($value)) {
        $value = pprek24_get_url_from_attachment($value, ['image/']);
      }
      break;

    case '16':
      $value = get_theme_mod('pprek24_favicon_16');
      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_16'];
      } elseif (is_int($value)) {
        $value = pprek24_get_url_from_attachment($value, ['image/']);
      }
      break;

    case 'webmanifest':
      $value = get_theme_mod('ppre24_favicon_webmanifest');
      if (empty(trim($value))) {
        $value = pprek24_customize_defaults()['favicon_webmanifest'];
      }
      break;

    case 'safari_pinned_tab':
      $value = get_theme_mod('pprek24_favicon_safari_pinned_tab');
      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_safari_pinned_tab'];
      } elseif (is_int($value)) {
        $value = pprek24_get_url_from_attachment($value, ['image/svg+xml']);
      }
      break;

    case 'safari_pinned_tab_color':
      $value = get_theme_mod('pprek24_favicon_safari_pinned_tab_color');
      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_safari_pinned_tab_color'];
      }
      break;

    case 'ico':
      $value = get_theme_mod('pprek24_favicon_ico');
      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_ico'];
      } elseif (is_int($value)) {
        $value = pprek24_get_url_from_attachment($value, ['image/x-icon']);
      }
      break;

    case 'msapplication_color':
      $value = get_theme_mod('pprek24_favicon_msapplication_color');
      if (empty($value)) {
        $value = pprek24_customize_defaults()['favicon_msapplication_color'];
      }
      break;

    case 'msapplication_config':
      $value = get_theme_mod('ppre24_favicon_msapplication_config');
      if (empty(trim($value))) {
        $value = pprek24_customize_defaults()['favicon_msapplication_config'];
      }
      break;

    default:
      throw new RangeException('Unknown favicon type.');
  }

  if ($echo) {
    echo $value;
  }

  return $value;
}
