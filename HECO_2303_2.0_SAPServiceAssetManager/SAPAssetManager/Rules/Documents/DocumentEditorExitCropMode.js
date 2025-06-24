import caption from './DocumentEditorCaption';

export default function DocumentEditorExitCropMode(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            pageProxy.setCaption(caption(context));
            pageProxy.setActionBarItemVisible('CropButton', true);
            pageProxy.setActionBarItemVisible('ResizeButton', true);
            pageProxy.setActionBarItemVisible('EditButton', true);
            pageProxy.setActionBarItemVisible('SaveButton', false);
            extension.exitCropMode();
        }
    }
    return Promise.resolve(true);
}
