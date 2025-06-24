import libCom from "../Common/Library/CommonLibrary";
export default function ZNoteCopyOperNoteOrderId(context) {
    let operCompleteNote = libCom.getStateVariable(context, 'ZOperationCompleteNote');
    return operCompleteNote.orderId;
}
