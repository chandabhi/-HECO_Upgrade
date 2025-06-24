
export default function SafetyCertificatesListViewOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
}
