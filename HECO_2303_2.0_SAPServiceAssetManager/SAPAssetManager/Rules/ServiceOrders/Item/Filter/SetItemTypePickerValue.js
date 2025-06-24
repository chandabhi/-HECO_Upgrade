
export default function SetItemTypePickerValue(control) {
    let pageProxy = control.getPageProxy();
    let table = pageProxy.evaluateTargetPath('#Page:ServiceItemsListViewPage/#Control:SectionedTable');

    if (table) {
        let filters = table.getFilters();
        if (filters && filters.length) {
            let value = [];
            filters.forEach(filter => {
                value.push(filter.filterItems);
            });
            control.setValue(value.flat());
        }
    }
}
