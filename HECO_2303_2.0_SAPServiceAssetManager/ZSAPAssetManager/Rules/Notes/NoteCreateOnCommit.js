import { NoteLibrary as NoteLib } from './NoteLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Constants from '../Common/Library/ConstantsLibrary';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';

export default function NoteCreateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
    if (!type) {
        throw new TypeError('Note Transaction Type must be defined');
    }
    let note = libCommon.getStateVariable(clientAPI, Constants.noteStateVariable);
    if (note) {
        if (IsCompleteAction(clientAPI)) {
            let updatedLocalNote = libCommon.getFieldValue(clientAPI, 'LongTextNote', '', null, true);
            note.NewTextString = updatedLocalNote.trim();

            WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                data: JSON.stringify(note),
                link: note['@odata.editLink'],
                value: clientAPI.localizeText('done'),
            });
        }
        
        if (type.noteUpdateAction) {
            libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, false);
            return clientAPI.executeAction(type.noteUpdateAction).then(() => {
                if(clientAPI.binding.WOHeader&&clientAPI.binding.WOHeader.OrderType==="TC01"){
                    let completeNote =  {
                        orderId: clientAPI.binding.OrderId,
                        longTextNote: 'OP_COMPLETE: ' + libCommon.getFieldValue(clientAPI, 'LongTextNote', '', null, true)
                    };
                    libCommon.setStateVariable(clientAPI, 'ZOperationCompleteNote', completeNote);
                }
                libCommon.setOnCreateUpdateFlag(clientAPI, '');
            });
        }
    } else if (type.noteCreateAction) {
        return clientAPI.executeAction(type.noteCreateAction).then((result) => {
            if (IsCompleteAction(clientAPI)) {
                //HECO Save Operation complete note for copying to WO Header
                let LongTextNote = libCommon.getFieldValue(clientAPI, 'LongTextNote', '', null, true)
                if(clientAPI.binding.WOHeader&&clientAPI.binding.WOHeader.OrderType==="TC01"){
                    LongTextNote = 'OP_COMPLETE: ' + LongTextNote;
                }
                let completeNote =  {
                    orderId: clientAPI.binding.OrderId,
                    longTextNote: LongTextNote
                };
                    
                libCommon.setStateVariable(clientAPI, 'ZOperationCompleteNote', completeNote);

                WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                    data: result.data,
                    link: JSON.parse(result.data)['@odata.editLink'],
                    value: clientAPI.localizeText('done'),
                });
            }
            libCommon.setOnCreateUpdateFlag(clientAPI, '');
         });
    }
}
