import libCommon from '../../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../../../Notes/NoteLibrary';
import Constants from '../../../../../SAPAssetManager/Rules/Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeNote(context) {
    libCommon.setStateVariable(context, 'IsOnRejectOperation', false);
    
    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
    } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) { 
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation());
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) { 
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation());
    } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) { 
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceOrder());
    } else if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) { 
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.serviceItem());
    }
    let odata = WorkOrderCompletionLibrary.getInstance().getBinding(context);
   
    let addedNote = WorkOrderCompletionLibrary.getStepData(context, 'note');
   
    if (WorkOrderCompletionLibrary.getInstance().isOperationFlow() && addedNote.TextString) {
        libCommon.setStateVariable(context, Constants.noteStateVariable, addedNote); 
        context.getPageProxy().setActionBinding(odata);
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
    }
    
    if (WorkOrderCompletionLibrary.getStepDataLink(context, 'note')) {
        let note = WorkOrderCompletionLibrary.getStepData(context, 'note');
        if (note && !note.NewTextString) {
            note.NewTextString = note.TextString;
        }
        libCommon.setStateVariable(context, Constants.noteStateVariable, note); 
        context.getPageProxy().setActionBinding(odata);
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
    }
    
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setOnChangesetFlag(context, false);
    libCommon.setStateVariable(context, 'SupervisorNote', true);
    
    let noteEntitySet = libCommon.getStateVariable(context, Constants.transactionNoteTypeStateVariable).component;
    if(context.binding&&context.binding['@odata.type']==="#sap_mobile.MyWorkOrderHeader"&&context.binding.OrderType== 'TC01'&&context.binding.Operations[0]){
        odata=context.binding.Operations[0];
    }
    let entitySet = odata['@odata.id'] + '/' + noteEntitySet;
    return NoteLib.noteDownload(context,entitySet ).then(() => {
        context.getPageProxy().setActionBinding(odata);
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
    });
}
