
export default function PriorityListPicker(context) {
    //HECO Filter priorities by NotifType
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${context.binding.NotificationType}'`).then(types => {
        let filter = '';
        if(types && types.length > 0) {
            filter = `$filter=PriorityType eq '${types.getItem(0).PriorityType}'&`;  
        }
        filter += '$orderby=PriorityDescription';
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], filter).then(results => {
            if (results._array.length > 0) {
                let filterArr = results._array.filter((el, index) =>
                    index === results._array.findIndex(other => el.PriorityDescription === other.PriorityDescription),
                );
                let returnArr = filterArr.map(i => ({ 'ReturnValue': i.Priority, 'DisplayValue': i.PriorityDescription }));
                return returnArr;
            } return [];
        });
    });
    
}
