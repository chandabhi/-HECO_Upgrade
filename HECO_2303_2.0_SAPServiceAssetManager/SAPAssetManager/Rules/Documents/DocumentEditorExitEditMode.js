import caption from './DocumentEditorCaption';
import isImageFormat from './DocumentEditorIsImageFormatWrapper';

export default function DocumentEditorExitEditMode(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            pageProxy.setCaption(caption(context));
            if (isImageFormat(context)) {
                pageProxy.setActionBarItemVisible('CropButton', true);
                pageProxy.setActionBarItemVisible('ResizeButton', true);
            }
            pageProxy.setActionBarItemVisible('EditButton', true);
            pageProxy.setActionBarItemVisible('ClearButton', false);
            pageProxy.setActionBarItemVisible('SaveButton', false);
            extension.exitEditMode();
        }
    }
    return Promise.resolve(true);
}
