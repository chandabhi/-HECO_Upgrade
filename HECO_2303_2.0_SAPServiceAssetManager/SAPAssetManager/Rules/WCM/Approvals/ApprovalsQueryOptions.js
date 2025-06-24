export default function ApprovalsQueryOptions(type) {
    const expand = '$expand=WCMApprovalProcessSegments,WCMApprovalProcessLongtexts';
    let filter;

    switch (type) {
        case 'received':
            filter = "WCMApprovalProcessSegments/any(seg: seg/SegmentInactive eq '')";
            break;
        case 'pending':
            filter = "WCMApprovalProcessSegments/all(seg: seg/SegmentInactive ne '')";
            break;
        default:
            filter = '';        
    }
    
    return `${expand}${filter ? '&$filter=' + filter : ''}`;
}
