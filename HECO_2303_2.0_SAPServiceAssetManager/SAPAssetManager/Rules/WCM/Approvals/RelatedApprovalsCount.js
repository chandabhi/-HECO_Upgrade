import CommonLibrary from '../../Common/Library/CommonLibrary';
import ApprovalsReadLink from './ApprovalsReadLink';

export default function RelatedApprovalsCount(context) {
    return CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), '');
}
