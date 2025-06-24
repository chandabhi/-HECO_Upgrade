import ToolbarGetStatusOptions from './ToolbarGetStatusOptions';
import pageToolbar from './DetailsPageToolbarClass';
import common from '../Library/CommonLibrary';
import IsBusinessObjectChangeable from './IsBusinessObjectChangeable';

export default function ToolbarItemGetVisibility(context) {
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
        return false;
    }

    if (!common.isDefined(possibleActions)) {
        let getStatusOptionsPromise = ToolbarGetStatusOptions(context);
        return getStatusOptionsPromise.then(items => {
            return toolbar.generatePossibleToolbarItems(context, items).then(() => {
                return toolbar.getToolbarItemVisibility(context, buttonName);
            });
        });
    } else {
        return toolbar.getToolbarItemVisibility(context, buttonName);
    }
}

