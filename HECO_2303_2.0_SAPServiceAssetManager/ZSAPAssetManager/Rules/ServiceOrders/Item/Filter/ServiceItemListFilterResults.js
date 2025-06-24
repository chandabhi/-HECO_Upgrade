
export default function ServiceItemListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:ServiceItemFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:ServiceItemFilterPage/#Control:TypeLstPicker/#Value');
    let result3 = context.evaluateTargetPath('#Page:ServiceItemFilterPage/#Control:StatusLstPicker/#FilterValue');

    let filterResults = [];

    if (result1) {
        filterResults.push(result1);
    }

    if (result2 && result2.length) {
        result2.forEach(filter => {
            filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, filter.DisplayValue, [filter.ReturnValue], true, undefined, [filter.DisplayValue]));
        });
    }

    if (result3) {
        filterResults.push(result3);
    }

    return filterResults;
}
