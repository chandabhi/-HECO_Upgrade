import libCom from '../Common/Library/CommonLibrary';

export default function PhaseModelStatusUpdateRollback(context) {

    var rollBack = libCom.getStateVariable(context, 'PhaseModelRollbackStatus');

    return {
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
        'Properties':
        {
            'Properties':
            {
                'MobileStatus': rollBack.MobileStatus,
                'EAMOverallStatusProfile': rollBack.EAMOverallStatusProfile,
                'EAMOverallStatus': rollBack.EAMOverallStatus,
                'Status': rollBack.Status,
                'EffectiveTimestamp': rollBack.EffectiveTimestamp,
                'CreateUserGUID': rollBack.CreateUserGUID,
                'CreateUserId': rollBack.CreateUserId,
            },
            'Target':
            {
                'EntitySet': 'PMMobileStatuses',
                'ReadLink': rollBack['@odata.readLink'],
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            // remove updatelinks for sap note changes
            'Headers':
            {
                'Transaction.Ignore': true,
                'OfflineOData.NonMergeable': true,
            },
            'ShowActivityIndicator': true,
        },
    };
}
