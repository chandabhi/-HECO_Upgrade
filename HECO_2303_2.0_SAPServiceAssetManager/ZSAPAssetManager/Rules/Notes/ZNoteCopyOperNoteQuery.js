import libCom from "../Common/Library/CommonLibrary";
export default function ZNoteCopyOperNoteQuery(context) {
    
    let operCompleteNote = libCom.getStateVariable(context, 'ZOperationCompleteNote');
    return "$filter=OrderId eq '" + operCompleteNote.orderId + "'";
}
