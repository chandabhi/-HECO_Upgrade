import WOMobileLib from './MobileStatus/WorkOrderMobileStatusLibrary';
import WorkOrderListViewSetCaption from './WorkOrderListViewSetCaption';

export default function WorkOrderListViewOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();

    return WOMobileLib.isAnyWorkOrderStarted(context).then(() => {
        return WorkOrderListViewSetCaption(context);
    });
}
