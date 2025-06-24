import S4ServiceLibrary from '../S4ServiceLibrary';

export default function GetItemFilters(context) {
    let fastFilters = [];
    let itemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);
    let partCategories = S4ServiceLibrary.getServiceProductPartCategories(context);
    let expenseCategories = S4ServiceLibrary.getServiceProductExpenseCategories(context);

    let itemFiltes = S4ServiceLibrary.getItemsCategoriesFilterCriteria(context, itemCategories, context.localizeText('service_item'));
    let partFilters = S4ServiceLibrary.getItemsCategoriesFilterCriteria(context, partCategories, context.localizeText('part'));
    let expenseFilters = S4ServiceLibrary.getItemsCategoriesFilterCriteria(context, expenseCategories, context.localizeText('expense'));

    return Promise.all([itemFiltes, partFilters, expenseFilters])
        .then(results => {
            let filters = results.flat();
            filters.forEach(filterCriteria => {
                fastFilters.push({
                    'FilterType': 'Filter',
                    'DisplayValue': filterCriteria.caption,
                    'ReturnValue': filterCriteria.filterItems[0],
                });
            });
            return fastFilters;
        })
        .catch(() => {
            return fastFilters;
        });
}
