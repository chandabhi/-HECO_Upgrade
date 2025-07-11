import libCommon from '../Common/Library/CommonLibrary';
import Validate from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import Constants from '../../../SAPAssetManager/Rules/Common/Library/ConstantsLibrary';

export default function NoteRemoteTextString(pageClientAPI) {

    let note = libCommon.getStateVariable(pageClientAPI, Constants.noteStateVariable);
    if (note && !Validate.evalIsEmpty(note.TextString)) {
        let existingRemoteNote = note.TextString;        
        if (!Validate.evalIsEmpty(note.NewTextString)) {
            // Remove the local note
            existingRemoteNote = existingRemoteNote.substring(0, existingRemoteNote.lastIndexOf(note.NewTextString));
        }
        return existingRemoteNote.trim();
    }

    return '';
}
