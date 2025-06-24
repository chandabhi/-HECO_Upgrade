import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function EditServiceItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateUpdateNav.action');
}
