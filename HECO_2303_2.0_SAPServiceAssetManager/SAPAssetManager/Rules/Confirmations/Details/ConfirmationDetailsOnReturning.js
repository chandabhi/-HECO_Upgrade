export default function ConfirmationDetailsOnReturning(clientAPI) {
    let sectionedTableProxy = clientAPI.getControls()[0];
    sectionedTableProxy.redraw();
    try {
        let toolbar = clientAPI.getPageProxy().getToolbar();
		toolbar.redraw();
    } catch (err) {
        // do nothing
    }
}
