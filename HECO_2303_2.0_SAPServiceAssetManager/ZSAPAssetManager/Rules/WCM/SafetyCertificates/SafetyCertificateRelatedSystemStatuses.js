

export default function SafetyCertificateRelatedSystemStatuses(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMDocumentHeaders', [], '$select=ActualSystemStatus')
        .then(statuses => {
            const uniqueStatuses = [...new Set(statuses.map(i => i.ActualSystemStatus))];
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$select=StatusText,SystemStatus&$filter=${uniqueStatuses.map(s => `(SystemStatus eq '${s}')`).join(' or ')}`)
                .then(sysStatuses =>  Array.from(sysStatuses, i => ({
                    ReturnValue: i.SystemStatus,
                    DisplayValue: i.StatusText,
                })));
    });
}
