
export default function RedrawCompletePage(context) {
    context.dismissActivityIndicator(); //Fix for 24408 - JCL
    var page = context.getPageProxy();
    var controls = page.getControls() || [];
    var sectionedTable = controls[0];
    if (sectionedTable) {
        sectionedTable.redraw();
    }
}
