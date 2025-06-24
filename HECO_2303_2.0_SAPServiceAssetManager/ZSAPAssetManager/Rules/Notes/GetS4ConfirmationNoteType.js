import GetS4NoteType from './GetS4NoteType';

export default function GetS4ConfirmationNoteType(context) {
    return GetS4NoteType(context, 'S4ServiceConfirmationLongTexts');
}
