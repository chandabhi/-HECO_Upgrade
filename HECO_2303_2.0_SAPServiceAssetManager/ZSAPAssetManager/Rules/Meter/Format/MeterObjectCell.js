import {ValueIfExists as format} from './Formatter';

export default function MeterObjectCell(context) {
    let property = context.getProperty();
    let device = context.binding;
    if (context.binding.Device_Nav) {
        device = context.binding.Device_Nav;
    }

    let returnValue = '';

    switch (property) {
        case 'Title':
            returnValue = `${device.Device} - ${device.Equipment_Nav.EquipDesc}`;
            break;
        case 'Subhead':
            returnValue = `${format(device.DeviceLocation_Nav.Description, '-')}`;
            break;
        case 'Footnote':
            returnValue = `${device.Equipment_Nav.ZMaterialDescription}`;
            break;
        case 'StatusText':
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipObjectStatuses', [], `$filter=EquipId eq '${context.binding.EquipmentNum}'`).then(result => {
                if (result && result.length > 0) {
                    let EquiStatusLink = result.getItem(0)['@odata.readLink'];
                    return context.read('/SAPAssetManager/Services/AssetManager.service', `${EquiStatusLink}`+'/SystemStatus_Nav', [], '').then(value => {
                        if (value && value.length > 0) {
                            return `${value.getItem(0).StatusText}`;
                        } else {
                            return '-';
                        }
                    });
                }
                return '-';
            });
        case 'SubstatusText':
            returnValue = `${device.DeviceBlocked ? context.localizeText('disconnect') : context.localizeText('connected')}`;
            break;
        default:
            returnValue = '';
    }

    return returnValue;
}
