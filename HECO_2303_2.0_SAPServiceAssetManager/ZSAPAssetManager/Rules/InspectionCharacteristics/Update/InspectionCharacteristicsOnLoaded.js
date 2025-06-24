import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import {FDCFilterable} from '../../FDC/DynamicPageGenerator';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsOnLoaded(context) {
    let filterable = new FDCFilterable(context);
	context.getClientData().Filterable = filterable;
    let sectionBindings = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
    for (let index = 0; index < sectionBindings.length; index++) {
        context.getControls()[0].sections[0]._context.binding = sectionBindings[index];
    }
    context.getControls()[0].redraw();
    try {
        if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        }
    } catch (err) {
        Logger.error('ErrorArchieve', err.message);
    }

    libCom.saveInitialValues(context);
}
