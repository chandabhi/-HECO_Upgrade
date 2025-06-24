import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function ApprovalInfoFormat(context, keyName) {
    const approvalSegment = context.binding.WCMApprovalProcessSegments.find((item) => item.SegmentInactive === '');

    if (keyName === 'Status') {
        return context.localizeText(approvalSegment ? 'issued' : 'pending');
    }

    if (!approvalSegment) {
        return '-';
    }

    const date = new OffsetODataDate(context, approvalSegment.CreatedOn, approvalSegment.EnteredAt);

    const expr = keyName || context.getProperty();

    switch (expr) {
        case 'Footnote':
        case 'IssuedBy':    
            return context.read('/SAPAssetManager/Services/AssetManager.service', `SAPUsers('${approvalSegment.EnteredBy}')`, [], '').then((data) => {
                const user = data.getItem(0);
                const userInfo = `${user ? user.UserName + ' (' + user.UserId + ')' : '-'}`;
                if (keyName) {
                    return userInfo;
                }
                return context.localizeText('issued_by_x', [userInfo]);
            });
        case 'StatusText':
            return context.formatDate(date.date(), '', '', {format:'medium'});
        case 'SubstatusText':
            return context.formatTime(date.date(), '', '', {format:'short'});   
        case 'IssueDate':
            return context.formatDatetime(date.date());    
    }
}
