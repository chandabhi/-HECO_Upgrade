import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function GetPriorityDescription(context, priority) {
    let clientData = libCommon.getClientDataForPage(context);
    if (clientData.Priorities !== undefined) {
        return clientData.Priorities[priority].PriorityDescription;
    }
    return GetPriorityDescriptionFromQuery(context, priority);
}

function GetPriorityDescriptionFromQuery(context, priority) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', ['PriorityDescription'], `$filter=Priority eq '${priority}' & $top=1`)
        .then(priorities => {
            if (!libVal.evalIsEmpty(priorities)) {
                return priorities.getItem(0).PriorityDescription;
            } else {
                return '';
            }
        });
}
