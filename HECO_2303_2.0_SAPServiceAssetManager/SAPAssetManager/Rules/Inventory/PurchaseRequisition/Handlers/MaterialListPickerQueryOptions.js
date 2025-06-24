import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function MaterialListPickerQueryOptions(context) {
    let data = context.binding;
    let plant;
    let storageLocation;

    if (data && data.Plant) {
        plant = data.Plant;
    } else {
        plant = CommonLibrary.getUserDefaultPlant();
    }

    if (data && data.StorageLocation) {
        storageLocation = data.StorageLocation;
    } else {
        storageLocation = CommonLibrary.getUserDefaultStorageLocation();
    }
						
    if (plant && storageLocation) {
        return `$filter=Plant eq '${plant}' and MaterialSLocs/any(slocs : slocs/StorageLocation eq '${storageLocation}')&$expand=Material,MaterialSLocs&$orderby=MaterialNum,Plant`;
    } else if (plant) {
        return `$filter=Plant eq '${plant}'&$expand=Material,MaterialSLocs&$orderby=MaterialNum,Plant`;
    } else {
        return "$filter=Plant eq '-1'&$expand=Material,MaterialSLocs&$orderby=MaterialNum,Plant";
    }
}
