
export default function IsServiceOrderFieldEditable(context) {
    let isEditable = true;

    if (context.binding && (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem' || 
            context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder')) { 
        isEditable = !context.binding.ObjectID;
    }

    return isEditable;
}
