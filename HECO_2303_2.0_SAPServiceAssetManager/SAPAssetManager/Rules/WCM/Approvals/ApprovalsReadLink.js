export default function ApprovalsReadLink(context) {
    const binding = context.binding['@odata.readLink'] ? context.binding : context.getPageProxy().binding;

    switch (binding['@odata.type']) {
        case '#sap_mobile.WCMApplication':
        case '#sap_mobile.WCMDocumentHeader':    
            return binding['@odata.readLink'] + '/WCMApprovalProcesses';   
        default:
            return 'WCMApprovalProcesses';
    }
}
