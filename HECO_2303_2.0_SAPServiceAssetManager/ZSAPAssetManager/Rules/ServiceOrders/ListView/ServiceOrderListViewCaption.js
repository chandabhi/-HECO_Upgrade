import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceOrderListViewCaption(context) {
    let queryOption = S4ServiceLibrary.getServiceOrdersFilters(context);
    let totalQueryOption = '';

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', totalQueryOption);
    let countPromise = context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], queryOption).then(result => {
        return result.length;
    });

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        let caption = '';
        
        params.push(count);
        params.push(totalCount);
        
        if (count === totalCount) {
            caption = context.localizeText('service_order_x', [totalCount]);
        } else {
            caption = context.localizeText('service_order_x_x', params);
        }

        return context.setCaption(caption);
    });
}
