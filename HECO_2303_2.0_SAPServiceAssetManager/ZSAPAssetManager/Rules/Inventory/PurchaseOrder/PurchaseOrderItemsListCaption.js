import ComLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default function PurchaseOrderItemsListCaption(clientAPI) {
    const queryOptions = "$filter=(PurchaseOrderId eq '" + clientAPI.getPageProxy().binding.PurchaseOrderId + "')";
    return ComLib.getEntitySetCount(clientAPI, 'PurchaseOrderItems', queryOptions).then(totalCount => {
        let count = 0;
        try {
            count = clientAPI.evaluateTargetPath('#Count');
        } catch (error) {
            Logger.error('PurchaseOrderItemsListCaption', error);
        }

        if (totalCount && totalCount !== count) {
            return clientAPI.localizeText('ibd_open_items') + ' (' + count + '/' + totalCount + ')';
        }
        return clientAPI.localizeText('ibd_open_items') + ' (' + count + ')';
    });
}
