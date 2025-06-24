import TimeSheetCreateUpdateDate from './TimeSheetCreateUpdateDate';
import FetchRequest from '../../Common/Query/FetchRequest';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import commonLib from '../../Common/Library/CommonLibrary';
import CrewLibrary from '../../Crew/CrewLibrary';
import ODataDate from "../../Common/Date/ODataDate";

export default function TimeSheetCreateUpdateOnCommit(context) {
    let manualSwitch = context.getControls('FormCellContainer')[0].getControl('ManualOrderSwitch').getValue();
    let OrderPicker = context.getControls('FormCellContainer')[0].getControl('RecOrderLstPkr');
    let OperationPicker = context.getControls('FormCellContainer')[0].getControl('OperationLstPkr');

    let ManualOrder = context.getControls('FormCellContainer')[0].getControl('ManualOrderInput');
    let ManualOperation = context.getControls('FormCellContainer')[0].getControl('ManualOperationInput');
    let ManualCostCenter = context.getControls('FormCellContainer')[0].getControl('ManualCostCenterInput');
    if(manualSwitch === true){
        OrderPicker.setValue('');
        OperationPicker.setValue('');
    }
    else if(manualSwitch===false){
        ManualOrder.setValue('');
        ManualOperation.setValue('');
        ManualCostCenter.setValue('');
    }
    if ((commonLib.IsOnCreate(context) || CrewLibrary.getTimesheetRemoveFlag()) && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return context.executeAction('/SAPAssetManager/Actions/Crew/TimeSheets/TimeSheetsEntryRequiredFields.action');
    }
    return createOverviewIfMissing(context).then(() => {

        let pageName = context.currentPage.id;

        let action;
        switch (pageName) {

            case 'TimeEntryCreateUpdatePageForWO':
            case 'TimeEntryCreateUpdatePage':
                action = '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateCreate.action';
                break;
            case 'TimeSheetEntryEditPage':
                action = '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateUpdate.action';
                break;

            default:
                return Promise.reject(false);

        }

        return context.executeAction(action);
    });
}


function createOverviewIfMissing(context) {

    let date = TimeSheetCreateUpdateDate(context);

    return new FetchRequest('CatsTimesheetOverviewRows').get(context, `datetime'${date}'`).catch(() => {
        // This is missing
        return createOverviewRow(context, date);
    });

}

function createOverviewRow(context, date) {
    context.getClientData().TimeSheetsOverviewRowDate = date;
    return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowCreate.action');
}
