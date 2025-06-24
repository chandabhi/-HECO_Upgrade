import libCom from "../Common/Library/CommonLibrary";
export default function ZNoteCopyOperNoteText(context) {
    let operCompleteNote = libCom.getStateVariable(context, 'ZOperationCompleteNote');
    return operCompleteNote.longTextNote;
}
