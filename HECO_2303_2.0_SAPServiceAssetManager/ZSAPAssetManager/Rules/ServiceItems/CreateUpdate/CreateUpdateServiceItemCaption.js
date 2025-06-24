import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function CreateUpdateServiceItemCaption(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return context.localizeText('add_service_order_item');
    }

    return context.localizeText('edit_service_order_item');
}
