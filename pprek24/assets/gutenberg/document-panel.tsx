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

    return (
        <PluginDocumentSettingPanel
            name='custom-document-panel'
            title={__('Custom Settings', 'pprek')}
        >
            <TextControl
                label={__('Custom Field', 'pprek')}
                value={postMeta?._custom_meta_field || ''}
                onChange={(value) => {
                    editPost({ 
                        meta: { 
                            ...postMeta, 
                            _custom_meta_field: value 
                        } 
                    });
                }}
             />
        </PluginDocumentSettingPanel>
    )

};

registerPlugin('pprek-document-panel', {
    render: CustomDocumentPanel
});