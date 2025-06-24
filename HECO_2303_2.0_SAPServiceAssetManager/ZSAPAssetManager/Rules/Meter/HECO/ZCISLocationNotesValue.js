import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ZCISLocationNotesValue(context) {

    let notes = CommonLibrary.getStateVariable(context, 'ZCISNotes');
    return notes.ZWorkLocationNotes;
}
