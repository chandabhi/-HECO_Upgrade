import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ZCISMRInstructionNotesValue(context) {

    let notes = CommonLibrary.getStateVariable(context, 'ZCISNotes');
    return notes.ZWorkMRInstructionNotes;
}
