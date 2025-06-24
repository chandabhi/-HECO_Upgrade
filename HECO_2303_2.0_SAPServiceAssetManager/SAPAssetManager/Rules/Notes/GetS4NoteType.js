import CommonLibrary from '../Common/Library/CommonLibrary';
import {NoteLibrary as NoteLib} from './NoteLibrary';

export default function GetS4NoteType(context, noteEntitySetName) {
    let entitySet = noteEntitySetName || NoteLib.getEntitySet(context);
    let type = '';
    let noteParamName = '';
    
    switch (entitySet) {
        case 'S4ServiceConfirmationLongTexts': 
            noteParamName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Note/S4ConfirmationNoteTypeParam.global').getValue();
            break;
        case 'S4ServiceConfirmationItemLongTexts': 
            noteParamName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Note/S4ConfirmationItemNoteTypeParam.global').getValue();
            break;
        case 'S4ServiceItemLongTexts':
            noteParamName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Note/S4ItemNoteTypeParam.global').getValue();
            break;
        case 'S4ServiceOrderLongTexts':
            noteParamName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Note/S4OrderNoteTypeParam.global').getValue();
            break;
        case 'S4ServiceRequestLongTexts':
            noteParamName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Note/S4RequestNoteTypeParam.global').getValue();
            break;
        default: 
            break;
    }

    if (noteParamName) {
        let noteGroupName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Note/NoteTypeGroup.global').getValue();
        type = CommonLibrary.getAppParam(context, noteGroupName, noteParamName) ;
    }

    return type;
}
