import ApprovalsReadLink from './ApprovalsReadLink';
import PendingApprovalsQueryOptions from './PendingApprovalsQueryOptions';
import ReceivedApprovalsQueryOptions from './ReceivedApprovalsQueryOptions';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ApprovalsObjectTableVisible(context) {
    let queryOptionsMethod;

    switch (context.getName()) {
        case 'PendingApprovalsListSection':
            queryOptionsMethod = PendingApprovalsQueryOptions;
            break;
        case 'ReceivedApprovalsListSection':
            queryOptionsMethod = ReceivedApprovalsQueryOptions;
            break;      
    }

    return CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), queryOptionsMethod()).then(count => {
        return !!count;
    });  
}
