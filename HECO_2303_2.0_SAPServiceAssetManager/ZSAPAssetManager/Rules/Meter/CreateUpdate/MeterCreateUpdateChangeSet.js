import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function MeterCreateUpdateChangeSet(context) {
    //HECO
    //Store OrderId, NotifNum and EquipNum for later CIS enhancements
    let dateFieldValue = libCommon.getFieldValue(context, 'HourEndDtPicker');

    let meterDetails = {
        OrderId: context.binding.OrderNum,
        NotifNum: context.binding.Workorder_Nav.NotificationNumber,
        EquipId: libCommon.getListPickerValue(context.getControls()[0].getControl('MeterLstPkr').getValue()),
        DateTime: new ODataDate(dateFieldValue)
    }
    libCommon.setStateVariable(context, 'ZDeviceDetails', meterDetails)
    //ENDHECO
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }

    let meterControl = libCommon.getTargetPathValue(context, '#Control:MeterLstPkr/#Value');
    if (meterTransactionType === 'REP_INST' || meterTransactionType === 'REP_INST_EDIT') {
        context.binding.BatchEquipmentNum=context.binding.Workorder_Nav.HeaderEquipment;
    } else {
        context.binding.BatchEquipmentNum=libCommon.getListPickerValue(meterControl);
    }


    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterInstallChangeset.action');
    } else if (meterTransactionType === 'INSTALL_EDIT' || meterTransactionType === 'REP_INST_EDIT') {  
        context.getClientData().BatchEquipmentNum = context.binding.BatchEquipmentNum;
        // Edit mode, need to remove the current OrderISULink first then create new one
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterOrderISULinkDelete.action').then(() => {
            //run the change set update
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterUpdateChangeset.action');
        });
    } else if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE') {
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterRemoveChangeset.action');
    } else if (meterTransactionType === 'REMOVE_EDIT' || meterTransactionType === 'REPLACE_EDIT') {
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterUpdateRemoveChangeset.action');
    }

    return '';
}
