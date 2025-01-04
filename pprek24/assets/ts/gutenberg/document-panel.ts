import { createElement } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { TextControl, SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const CustomDocumentPanel = () => {
    const postMeta = useSelect((select) => 
        select('core/editor').getEditedPostAttribute('meta')
    , []);

    const { editPost } = useDispatch('core/editor');

    return createElement(
        PluginDocumentSettingPanel,
        {
            name: 'custom-document-panel',
            title: __('Custom Settings', 'pprek'),
            icon: 'admin-settings' // Optional icon
        },
        createElement(TextControl, {
            label: __('Custom Field', 'pprek'),
            value: postMeta?._custom_meta_field || '',
            onChange: (value) => {
                editPost({ 
                    meta: { 
                        ...postMeta, 
                        _custom_meta_field: value 
                    } 
                });
            }
        }),
        createElement(SelectControl, {
            label: __('Display Type', 'pprek'),
            value: postMeta?._display_type || 'default',
            options: [
                { label: __('Default', 'pprek'), value: 'default' },
                { label: __('Featured', 'pprek'), value: 'featured' },
                { label: __('Minimal', 'pprek'), value: 'minimal' }
            ],
            onChange: (value) => {
                editPost({ 
                    meta: { 
                        ...postMeta, 
                        _display_type: value 
                    } 
                });
            }
        })
    );
};

registerPlugin('pprek-document-panel', {
    render: CustomDocumentPanel
});