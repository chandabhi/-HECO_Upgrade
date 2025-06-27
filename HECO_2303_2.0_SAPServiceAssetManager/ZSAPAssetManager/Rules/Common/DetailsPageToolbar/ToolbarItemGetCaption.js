import ToolbarGetStatusOptions from './../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarGetStatusOptions';
import pageToolbar from './../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import IsBusinessObjectChangeable from './../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/IsBusinessObjectChangeable';

export default function ToolbarItemGetCaption(context) {
    // we can't change mobile status of an object if we are not on the right level assignment, so avoid doing these steps
    const buttonName = context.getName();
    let toolbar = pageToolbar.getInstance();
    let possibleActions = toolbar.getToolbarItems(context);
    
    const pageName = common.getPageName(context);
    let statusVisibileForWO = false; // E_58 status change - Manipulating status visibility

    if (pageName === 'WorkOrderDetailsPage' && possibleActions.length) {
        statusVisibileForWO = true;
    }
    if (!IsBusinessObjectChangeable(context,statusVisibileForWO)) {
        return '';
    }

    // const buttonName = context.getName();
    // let toolbar = pageToolbar.getInstance();
    // let possibleActions = toolbar.getToolbarItems(context);

    if (!common.isDefined(possibleActions)) {
        let getStatusOptionsPromise = ToolbarGetStatusOptions(context);
        return getStatusOptionsPromise.then(items => {
            return toolbar.generatePossibleToolbarItems(context, items).then(() => {
                return toolbar.getToolbarItemCaption(context, buttonName);
            });
        });
    } else {
        return toolbar.getToolbarItemCaption(context, buttonName);
    }
}
