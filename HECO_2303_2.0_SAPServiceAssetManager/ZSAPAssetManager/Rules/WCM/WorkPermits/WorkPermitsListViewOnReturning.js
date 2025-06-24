
export default function WorkPermitsListViewOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();
}
