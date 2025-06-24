export default function WorkApprovalsHeaderStatuses(context) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMApprovals', [], '')
    .then(approvals=>[...new Map(approvals.map(i => [i.ActualSystemStatus,i])).values()])
    .then(result=>{ 
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$filter=${result.map(status=>`SystemStatus eq '${status.ActualSystemStatus}'`).join(' or ')}&$select=StatusText,SystemStatus`).then(systemStatuses=>Array.from(systemStatuses,k=>
            ({
                ReturnValue: k.SystemStatus,
                DisplayValue: k.StatusText,
            }),
        ));
    });
}
