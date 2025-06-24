export default function RejectShowOperation(context) {
    
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' ||
        businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return true;
    }
    return false;
}
