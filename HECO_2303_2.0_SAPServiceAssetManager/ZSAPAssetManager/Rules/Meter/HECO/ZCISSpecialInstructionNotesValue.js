import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ZCISSpecialInstructionNotesValue(context) {

    let notes = CommonLibrary.getStateVariable(context, 'ZCISNotes');
    return notes.ZWorkSpecialInstructionNotes;
}
