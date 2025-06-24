import libMeter from '../../Meter/Common/MeterLibrary';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import MetersListViewOnReturn from '../../WorkOrders/Meter/MetersListViewOnReturn';

export default function DisconnectAllMeters(context) {
    let helper = new FDCSectionHelper(context);

    const isDisconnect = libMeter.getISUProcess(context.binding.OrderISULinks) === 'DISCONNECT';

    return helper.run((sectionBinding, section) => {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
            'Target':
            {
                'EntitySet': 'Devices',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': sectionBinding.Device_Nav['@odata.readLink'],
            },
            'Properties':
            {
                'DeviceBlocked' : isDisconnect,
            },
            'Headers':
            {
                'Transaction.Ignore': 'true',
            },
        }}).then(() => context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
            'Target':
            {
                'EntitySet': 'DisconnectionObjects',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': sectionBinding['@odata.readLink'],
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
            },
            'Properties':
            {
                'ActivityDate': '/SAPAssetManager/Rules/Meter/DisconnectReconnect/ActivityDate.js',
                'ActivityTime': '/SAPAssetManager/Rules/Meter/DisconnectReconnect/ActivityTime.js',
                'DisconnectType': (() => {
                    if (isDisconnect) {
                        return section.getControl('TypeLstPkr').getValue()[0].ReturnValue;
                    } else {
                        return '';
                    }
                })(),
            },
            'Headers':
            {
                'OfflineOData.TransactionID': String(sectionBinding.ActivityNum) + String(sectionBinding.DocNum),
            },
        }}));
    }).then(() => MetersListViewOnReturn(context));
}
