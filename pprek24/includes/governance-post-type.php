<?php

function pprek24_create_bylaws_post_type (): void {
  $labels = [
    'name'                =>  __('Verwaltungsdokumente', 'pprek24'),  // 'Governance',
    'singular_name'       =>  __('Verwaltungsdokument', 'pprek24'),  // 'Governance Document',
    'menu_name'           =>  __('Verwaltungsdokumente', 'pprek24'),  // 'Governance',
    'add_new'             =>  _x('Neues Dokument hinzufügen', 'Governance', 'pprek24'),  // 'Add New Document',
    'add_new_item'        =>  __('Neues Verwaltungsdokument anlegen', 'pprek24'),  // 'Add New Governance Document',
    'edit_item'           =>  _x('Dokument bearbeiten', 'Governance', 'pprek24'),  // 'Edit Governance Document',
    'new_item'            =>  __('Neues Verwaltungsdokument', 'pprek24'),  // 'New Governance Document',
    'view_item'           =>  __('Verwaltungsdokument ansehen', 'pprek24'),  // 'View Governance Document',
    'search_items'        =>  __('Verwaltungsdokumente suchen', 'pprek24'),  // 'Search Governance Documents',
    'not_found'           =>  __('Keine Verwaltungsdokumente gefunden', 'pprek24'),  // 'No governance documents found',
    'not_found_in_trash'  =>  __('Keine Verwaltungsdokumente im Papierkorb', 'pprek24')  // 'No governance documents found in Trash'
  ];

  $args = [
    'labels'              => $labels,
    'public'              => true,
    'publicly_queryable'  => true,
    'show_ui'             => true,
    'show_in_menu'        => true,
    'query_var'           => true,
    'rewrite'             => array('slug' => 'governance'),
    'capability_type'     => 'page',
    'has_archive'         => true,
    'hierarchical'        => true,
    'menu_icon'           => 'dashicons-media-text',
    'menu_position'       => 5,
    'supports'            => array(
      'title',
      'editor',
      'thumbnail',
      'excerpt',
      'page-attributes',
      'custom-fields',
      'revisions'       // Added revisions support for document history
    ),
    'show_in_rest'        => false // Enable Gutenberg editor
  ];

  register_post_type('governance', $args);

  register_post_meta('governance', 'last_modified', [
    'type'              => 'object',
    'single'            => true,
    'show_in_rest'      => [
      'schema' => [
        'type' => 'object',
        'properties' => [
          'last_modified' => [
            'type' => 'string',
            'format' => 'date-time'
          ],
          'text' => [
            'type' => 'string'
          ]
        ],
        'required' => ['last_modified']
      ]
    ],
    'sanitize_callback' => 'sanitize_text_field'
  ]);

  register_post_meta('governance', 'document_sections', [
    'type'          =>  'array',
    'single'        =>  true,
    'show_in_rest'  => [
      'schema' => [
        'items' => [
          'type' => 'object',
          'properties' => [
            'section_number' => ['type' => 'string', 'pattern' => '^[1-9]+\d*[a-z]*$'],
            'title' => ['type' => 'string'],
            'content' => [
              'type' => 'array',
              'items' => [
                'type' => 'object',
                'properties' => [
                  'paragraph_number' => ['type' => 'string', 'pattern' => '^[1-9]+\d*[a-z]*$'],
                  'content' => ['type' => 'string']
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ]);
}

function pprek24_render_governance_editor(WP_Post $post): void {
  wp_nonce_field('governance_editor_nonce', 'governance_nonce');

  /** @var array{array{last_modified: string, text: string}} $last_modified */
  $last_modified = get_post_meta($post->ID, 'last_modified', true) ?: [];
  /** @var array{array{section_number: string, title: string, content: array{array{paragraph_number: string, title: string, content: string}}}} $sections */
  $sections = get_post_meta($post->ID, 'document_sections', true) ?: [];

  // Add necessary styles and scripts
  wp_enqueue_script('jquery-ui-sortable');
  ?>
  <div class="governance-editor">
    <div class="document-meta">
      <p>
        <label for="governance_last_modified"><strong><?php _e('Zuletzt geändert'); ?></strong></label>
        <input type="date" id="governance_last_modified" name="governance_last_modified" value="<?php echo esc_attr($last_modified['last_modified'] ?? ''); ?>">
      </p>
      <p>
        <label for="governance_last_modified_text"><strong><?php _e('Zuletzt geändert Text'); ?></strong></label>
        <input type="text" id="governance_last_modified_text" name="governance_last_modified_text" value="<?php echo esc_attr($last_modified['last_modified'] ?? ''); ?>">
      </p>
    </div>
    <div id="sections-container">
      <?php foreach ($sections as $index => $section): ?>
      <div class="section" data-index="<?php echo $index; ?>">
        <div class="section-header">
          <input
            type="text"
            name="sections[<?php echo $index; ?>][section_number]"
            pattern="^[1-9]+\d*[a-z]*$"
            value="<?php echo esc_attr($section['section_number']); ?>"
            placeholder="6a"
            class="small-text"
          >
          <input
            type="text"
            name="sections[<?php echo $index; ?>][title]"
            value="<?php echo esc_attr($section['title']); ?>"
            placeholder="Kreisparteitag"
            class="regular-text"
          >
          <button type="button" class="button remove-section"><?php _e('Remove'); ?></button>
        </div>
        <div class="section-content" data-count="<?php echo count($section['content']); ?>">
          <?php foreach ($section['content'] as $index2 => $paragraph): ?>
          <div class="paragraph">
            <input
              type="text"
              name="paragraph[<?php echo $index; ?>][<?php echo $index2 ?>][paragraph_number]"
              pattern="^[1-9]+\d*[a-z]*$"
              value="<?php echo esc_attr($paragraph['paragraph_number']); ?>"
              placeholder="1a"
              class="small-text"
            >
            <textarea
              name="paragraph[<?php echo $index; ?>][<?php echo $index2 ?>][content]"
              rows="4"
              class="widefat"
            ><?php echo esc_textarea($paragraph['content']); ?></textarea>
            <button type="button" class="button remove-paragraph"><?php _e('Remove'); ?></button>
          </div>
          <?php endforeach; ?>
        </div>
        <button type="button" id="add-paragraph" data-section="<?php echo esc_attr($index); ?>" class="button button-primary add-paragraph"><?php _e('Absatz hinzufügen', 'pprek24'); ?></button>
      </div>
      <?php endforeach; ?>
    </div>

    <button type="button" id="add-section" class="button button-primary"><?php _e('Paragraph hinzufügen', 'pprek24' ); ?></button>
  </div>
  <style>
    .governance-editor {
        padding: 10px;
    }
    .section {
        border: 1px solid #ddd;
        margin-block-end: 10px;
        padding: 10px;
        background: #fff;
    }
    .section-header {
        margin-block-end: 10px;
    }
    .section-content textarea {
        inline-size: 100%;
    }
    .small-text {
        width: 100px;
    }
  </style>
  <script>
    jQuery(document).ready(function($) {
      const container = $('#sections-container')
      let nextIndex = <?php echo count($sections); ?>

      container.sortable({
        handle: '.section-header',
        placeholder: 'section-placeholder'
      })

      $('#add-section').click(function () {
        const template = `
          <div class="section" data-index="${nextIndex}">
            <div class="section-header">
              <input
                type="text"
                name="sections[${nextIndex}][section_number]"
                pattern="^[1-9]+\\d*[a-z]*$"
                placeholder="6a"
                class="small-text"
              >
              <input
                type="text"
                name="sections[${nextIndex}][title]"
                placeholder="Kreisparteitag"
                class="regular-text"
              >
              <button type="button" class="button remove-section"><?php _e('Remove'); ?></button>
            </div>
            <div class="section-content">
            </div>
            <button type="button" data-section="${nextIndex}" class="button button-primary add-paragraph"><?php _e('Absatz hinzufügen', 'pprek24'); ?></button>
          </div>
        `
        container.append(template)
        nextIndex++
      })

      $(document).on('click', '.remove-section', function () {
        $(this).closest('.section').remove()
      })

      $(document).on('click', '.add-paragraph', function () {
        const sectionIndex = $(this).data('section')
        const content = $(this).closest('.section-content')
        let index = parseInt(content.data('count'))

        const template = `
          <div class="paragraph">
            <input
              type="text"
              name="paragraph[${sectionIndex}][<?php echo $index2 ?>][paragraph_number]"
              pattern="^[1-9]+\d*[a-z]*$"
              placeholder="1a"
              class="small-text"
            >
            <textarea
              name="paragraph[${sectionIndex}][<?php echo $index2 ?>][content]"
              rows="4"
              class="widefat"
            ></textarea>
            <button type="button" class="button remove-paragraph"><?php _e('Remove'); ?></button>
          </div>
        `

        content.append(template)
        content.data('count', ++index)
      })

      $(document).on('click', '.remove-paragraph', function () {
        const paragraph = $(this).closest('.paragraph')
        const content = $(this).closest('.section-content')
        let index = parseInt(content.data('count'))

        paragraph.remove()
        content.data('count', --index)
      })
    })
  </script>
  <?php
}

function pprek24_add_governance_editor_meta_box(WP_Post $post): void {
  add_meta_box(
    'pprek24_governance_editor',
    __('Inhalt', 'pprek24'),
    'pprek24_render_governance_editor',
    'governance',
    'normal',
    'high'
  );
}