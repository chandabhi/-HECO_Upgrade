import { TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';
import crewAllUsersQueryOptions from '../../../Crew/Employees/EmployeeQueryOptions';

export default function TimeSheetEntryCreateUpdateOnPageLoad(context) {
    libTSEvent.TimeSheetEntryCreateUpdateOnPageLoad(context);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        let pageProxy = context;
        if (typeof pageProxy.getPageProxy === 'function') { 
            pageProxy = context.getPageProxy();
        }
        let actionContext = pageProxy.getActionBinding();
        if (libVal.evalIsEmpty(actionContext)) {
            actionContext = context.binding;
        }
        let personnelNumber = '';
        if (!libVal.evalIsEmpty(actionContext) && Object.prototype.hasOwnProperty.call(actionContext,'TimeSheetEmployee')) {
            personnelNumber = actionContext.TimeSheetEmployee;
        }
        if (libVal.evalIsEmpty(personnelNumber)) { //Get current employee if not already set 
            if (actionContext.Employee) {
                personnelNumber = actionContext.Employee.PersonnelNumber;
            }
        }
        if (!libVal.evalIsEmpty(personnelNumber)) { //Set to single employee, read only
            let listPicker = context.getControl('FormCellContainer').getControl('MemberLstPkr');
            listPicker.setValue(personnelNumber);
            libCom.setFormcellNonEditable(listPicker);
        } else { //Set to all employees, editable
            let listPicker = context.getControl('FormCellContainer').getControl('MemberLstPkr');
            return ConfirmationAllUsers(context).then((values) =>{
                listPicker.setValue(values);
                libCom.saveInitialValues(context);
            });
        }
    }
    libCom.saveInitialValues(context);
}

function ConfirmationAllUsers(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], crewAllUsersQueryOptions(context)).then(function(results) {
        let aPersonNumbers = [];
        if (results.length > 0) {
            results.forEach(employee => {
                aPersonNumbers.push(employee.Employee.PersonnelNumber);
            });
        }
        return aPersonNumbers;
    });
}
