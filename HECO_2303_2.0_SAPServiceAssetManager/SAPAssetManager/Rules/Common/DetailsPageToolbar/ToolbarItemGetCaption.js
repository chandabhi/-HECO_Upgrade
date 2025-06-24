import ToolbarGetStatusOptions from './ToolbarGetStatusOptions';
import pageToolbar from './DetailsPageToolbarClass';
import common from '../Library/CommonLibrary';
import IsBusinessObjectChangeable from './IsBusinessObjectChangeable';

export default function ToolbarItemGetCaption(context) {
    // we can't change mobile status of an object if we are not on the right level assignment, so avoid doing these steps
    if (!IsBusinessObjectChangeable(context)) {
        return '';
    }

    const buttonName = context.getName();
    let toolbar = pageToolbar.getInstance();
    let possibleActions = toolbar.getToolbarItems(context);

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
