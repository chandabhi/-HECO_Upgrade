import libCommon from '../Common/Library/CommonLibrary';

export default function ReferenceObjectsEntitySet(context) {
    let headerEntitySetName = libCommon.getEntitySetName(context);

    if (headerEntitySetName === 'S4ServiceOrders' || headerEntitySetName === 'S4ServiceItems' || headerEntitySetName === 'S4ServiceConfirmationItems') {
        return context.binding['@odata.readLink'] + '/RefObjects_Nav';
    } else if (headerEntitySetName === 'S4ServiceRequests') {
        return context.binding['@odata.readLink'] + '/RefObj_Nav';
    }
}
