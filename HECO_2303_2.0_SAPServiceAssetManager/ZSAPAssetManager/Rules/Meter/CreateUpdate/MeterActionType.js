import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterActionType(context) {

    let formCellContainer = context.getControl('FormCellContainer');
    let installationControl = formCellContainer.getControl('InstallationLstPkr');
    let installation = libCommon.getListPickerValue(installationControl.getValue());
    let technicalInstallation = libCommon.getAppParam(context, 'METERACTION', 'TechinicalInstallation');
    let fullInstallation = libCommon.getAppParam(context, 'METERACTION', 'FullInstallation');
    let technicalRemoval = libCommon.getAppParam(context, 'METERACTION', 'TechnicalRemoval');
    let fullRemoval = libCommon.getAppParam(context, 'METERACTION', 'FullRemoval');
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    //HECO
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationTasks', [], `$filter=NotificationNumber eq '${context.binding.Workorder_Nav.NotificationNumber}' and TaskCode eq '0040'`).then(function (notifResult) {
        if (notifResult && notifResult.length > 0) {
            //If Notif task 40 exists then use technical install
            return technicalInstallation;
        } else {
            //Standard SAM calculation

            if (meterTransactionType === 'INSTALL' || meterTransactionType === 'INSTALL_EDIT' || meterTransactionType === 'REP_INST' || meterTransactionType === 'REP_INST_EDIT') {
                if (installation) {
                    return fullInstallation;
                }
                return technicalInstallation;
            } else if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REMOVE_EDIT' || meterTransactionType === 'REPLACE' || meterTransactionType === 'REPLACE_EDIT') {
                if (installation) {
                    return fullRemoval;
                }
                return technicalRemoval;
            }
            return '';
        }
    });
    //HECO END
}
