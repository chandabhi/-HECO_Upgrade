import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function StorageLocationListPickerQueryOptions(context) {
    let options = '$orderby=StorageLocation';

    if (!CommonLibrary.IsOnCreate(context) && context.binding && context.binding.Plant) {
        options += `&$filter=Plant eq '${context.binding.Plant}'`;
    }

    return options;
}
