export default function ApprovalsObjectTableCaption(context) {
    switch (context.getName()) {
        case 'PendingApprovalsListSection':
            return context.localizeText('pending');
        case 'ReceivedApprovalsListSection':
            return context.localizeText('issued');    
    }
}
