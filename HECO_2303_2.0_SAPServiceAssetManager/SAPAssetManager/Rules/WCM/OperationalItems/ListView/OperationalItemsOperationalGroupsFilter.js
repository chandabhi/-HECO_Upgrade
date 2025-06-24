export default function OperationalItemsOperationalGroupsFilter(context) {
    const filterData =  {
        name: 'OpGroup',
        values: [],
    };

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMOpGroups', [], '').then(data => {
        data.forEach(group => {
            filterData.values.push({ReturnValue: group.OpGroup, DisplayValue: group.TextOpGroup});
        });

        return filterData;
    }, () => {
        return filterData;
    });
}
