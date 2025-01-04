import { createElement } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const CustomSidebar = () => {
    const postMeta = useSelect((select) => 
        select('core/editor').getEditedPostAttribute('meta')
    , []);

    const { editPost } = useDispatch('core/editor');

    const updateMetaValue = (value: string) => {
        editPost({ meta: { ...postMeta, _custom_meta_field: value } });
    };

    return createElement(
        'div',
        null,
        createElement(PluginSidebarMoreMenuItem, {
            target: "pprek-sidebar"
        }, __('Custom Settings', 'pprek')),
        createElement(PluginSidebar, {
            name: "pprek-sidebar",
            title: __('Custom Settings', 'pprek')
        },
            createElement(PanelBody, null,
                createElement(TextControl, {
                    label: __('Custom Field', 'pprek'),
                    value: postMeta?._custom_meta_field || '',
                    onChange: updateMetaValue
                })
            )
        )
    );
};

registerPlugin('pprek-sidebar', {
    render: CustomSidebar,
    icon: 'admin-settings'
});