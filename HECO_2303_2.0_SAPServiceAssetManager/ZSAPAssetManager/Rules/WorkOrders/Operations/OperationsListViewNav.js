import libCom from '../../Common/Library/CommonLibrary';
import OperationsListViewWithResetFiltersNav from './OperationsListViewWithResetFiltersNav';

export default function OperationsListViewNav(context) {

    //OMNI Making sure any cached binding from Omni is cleared
    libCom.clearStateVariable(context,'BINDINGOBJECT');
    context._context.binding = undefined;
    context.getPageProxy()._context.binding = undefined;
    //OMNI End

    libCom.setStateVariable(context,'FromOperationsList', true);
    return OperationsListViewWithResetFiltersNav(context);
}
