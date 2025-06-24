export default function PriorityFilter(context) {
    const prevPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let pageName = '';
    if (prevPage && prevPage._page) {
        pageName = prevPage._page.id;
    }
    var priorities = [];
    var displayPriorities = [];
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '$orderby=PriorityDescription').then(function(data) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let priority = data.getItem(i);
                let returnValue = `(Priority eq '${priority.Priority}' and PriorityType eq '${priority.PriorityType}')`;
                if (pageName === 'ServiceOrdersListViewPage' || pageName === 'ServiceRequestsListViewPage') {
                    returnValue = `(Priority eq '${priority.Priority}')`;
                }
                let displayValue = priority.PriorityDescription;
                let obj = {ReturnValue: returnValue, DisplayValue: displayValue};
                if (!displayPriorities.includes(displayValue)) {
                    priorities.push(obj);
                    displayPriorities.push(displayValue);
                } else {
                    for (let j=0; j< priorities.length; j++) {
                        if (priorities[j].DisplayValue === displayValue) {
                            let updatedReturnValue = priorities[j].ReturnValue + ' or ' + returnValue;
                            obj = {ReturnValue: updatedReturnValue, DisplayValue: displayValue};
                            priorities.splice(j, 1, obj);
                            break;
                        }
                    }
                }
            }
        }
        return priorities; 
    }, function() {
        return {name: 'Failed', values: []};
    });
}
