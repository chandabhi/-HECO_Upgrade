import ToolbarGetStatusOptions from './../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarGetStatusOptions';
import pageToolbar from './../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import IsBusinessObjectChangeable from './IsBusinessObjectChangeable';

export default function ToolbarItemGetOnPress(context) {
    // we can't change mobile status of an object if we are not on the right level assignment, so avoid doing these steps
    const pageName = common.getPageName(context);
    let statusVisibileForWO = false; // Manipulating status visibility

    if (pageName === "WorkOrderDetailsPage") {
        statusVisibileForWO = true;
    }
    if (!IsBusinessObjectChangeable(context,statusVisibileForWO)) {
        return '';
    }
    const currentPageName = common.getPageName(context);
    const buttonName = context.getName();
    let toolbar = pageToolbar.getInstance();
    let possibleActions = toolbar.getToolbarItems(context);

    if (!common.isDefined(possibleActions)) {
        let getStatusOptionsPromise = ToolbarGetStatusOptions(context,statusVisibileForWO);
        return getStatusOptionsPromise.then(items => {
            return toolbar.generatePossibleToolbarItems(context, items).then(() => {
                return context.executeAction(toolbar.getToolbarItemOnPressAction(context, buttonName));
            });
        });
    } else {
        return context.executeAction(toolbar.getToolbarItemOnPressAction(context, buttonName));
    }
}
