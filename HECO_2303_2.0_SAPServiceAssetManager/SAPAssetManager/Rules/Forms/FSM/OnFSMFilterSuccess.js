import libVal from '../../Common/Library/ValidationLibrary';
export default function OnFSMFilterSuccess(context) {
    let queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances',queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(counts) {
        let totalCount = counts[0];
        let count = counts[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('smart_forms_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('smart_forms_x_x', params));
    });
}
