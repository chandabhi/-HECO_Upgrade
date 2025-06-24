export default function BusinessPartnerQueryOptions(context) {
    let expandList = [
        'Address_Nav',
        'Address_Nav/AddressCommunication',
        'AddressAtWork_Nav',
        'AddressAtWork_Nav/AddressAtWorkComm',
        'PartnerFunction_Nav',
        'Employee_Nav',
        'Employee_Nav/EmployeeAddress_Nav',
        'Employee_Nav/EmployeeCommunications_Nav',
    ];

    if (context.binding) {
        let entityType = context.binding['@odata.type'];
        let partnerFuncLink = 'S4PartnerFunc_Nav';
        if (entityType === '#sap_mobile.S4ServiceOrder' ||
            entityType === '#sap_mobile.S4ServiceRequest' ||
            entityType === '#sap_mobile.S4ServiceItem' ||
            entityType === '#sap_mobile.S4ServiceConfirmationItem') {

            if (entityType === '#sap_mobile.S4ServiceRequest') {
                partnerFuncLink = 'S4PartnerFunction_Nav';
            }

            expandList = [
                partnerFuncLink,
                'BusinessPartner_Nav',
                'BusinessPartner_Nav/Address_Nav',
                'BusinessPartner_Nav/Address_Nav/AddressCommunication',
                'BusinessPartner_Nav/Customer_Nav',
            ];
        }
    }

    let queryOptions = '$expand=' + expandList.join(',');
    return queryOptions;
}
