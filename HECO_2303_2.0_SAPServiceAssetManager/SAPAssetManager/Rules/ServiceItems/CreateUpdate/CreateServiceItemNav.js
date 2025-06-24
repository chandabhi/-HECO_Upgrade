import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function CreateServiceItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateChangeset.action');
}
