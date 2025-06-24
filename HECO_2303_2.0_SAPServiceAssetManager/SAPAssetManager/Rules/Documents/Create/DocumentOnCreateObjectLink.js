import ComLib from '../../Common/Library/CommonLibrary';
import getDocsData from './DocumentOnCreateGetStateVars';

export default function DocumentOnCreateObjectLink(controlProxy) {
    const { Class, ObjectLink, parentEntitySet } = getDocsData(controlProxy);
    let paramGroupName = 'DOCUMENT';

    if (ComLib.isDefined(ObjectLink)) {
        return ObjectLink;
    }

    if (parentEntitySet === 'S4ServiceOrders' || parentEntitySet === 'S4ServiceConfirmations' || parentEntitySet === 'S4ServiceRequests') {
        paramGroupName = 'S4OBJECTTYPE';
    }

    let value = ComLib.getAppParam(controlProxy, paramGroupName, Class);
    return value ? value : '';
}
