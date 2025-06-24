import CommonLibrary from '../../Common/Library/CommonLibrary';
import ShowAccessoryButtonIcon from '../MaterialDocument/ShowAccessoryButtonIcon';
import MaterialHeaderButtonVisible from './MaterialHeaderButtonVisible';

export default function MaterialDocItemEditVisible(context) {
    const item = context.getPageProxy().getClientData().item || context.binding;
    if (item['@odata.type'].includes('PurchaseRequisitionHeader') || item['@odata.type'].includes('PurchaseRequisitionItem')) {
        const isLocal = CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        if (!isLocal) {
            return false;
        }
    }
    if (!item['@odata.type'].includes('MaterialDocItem')) {
        return true;
    }
    return ShowAccessoryButtonIcon(context).then((icon) => {
        return icon && icon.length ? MaterialHeaderButtonVisible(context, true) : false;
    });
}
