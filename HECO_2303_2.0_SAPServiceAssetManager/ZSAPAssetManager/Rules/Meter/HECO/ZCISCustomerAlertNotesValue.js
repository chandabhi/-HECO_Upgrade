import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ZCISCustomerAlertNotesValue(context) {

    let notes = CommonLibrary.getStateVariable(context, 'ZCISNotes');
    return notes.ZWorkCustomerAlertNotes;
}
