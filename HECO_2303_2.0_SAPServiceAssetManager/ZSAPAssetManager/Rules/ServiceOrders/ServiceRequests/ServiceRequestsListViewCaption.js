import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceResuestsListViewCaption(context) {
    let queryOption = S4ServiceLibrary.getServiceRequestsFilters(context);
    let totalQueryOption = '';

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', totalQueryOption);
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        let caption = '';

        params.push(count);
        params.push(totalCount);

        if (count === totalCount) {
            caption = context.localizeText('service_request_x', [totalCount]);
        } else {
            caption = context.localizeText('service_request_x_x', params);
        }

        return context.setCaption(caption);
    });
}
