import ApprovalsReadLink from './ApprovalsReadLink';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ReceivedApprovalsQueryOptions from './ReceivedApprovalsQueryOptions';

export default function ApprovalsPageCaption(context) {
    const promises = [CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), ReceivedApprovalsQueryOptions()),CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), '')];

    return Promise.all(promises).then((counts) => {
        return context.localizeText('approvals_x_x', [counts[0],counts[1]]);
    });
}
