import EnableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
* Show/hide edit equipment button based on Persona or User Authorization 
* @param {IClientAPI} context
*/
export default function EquipmentEditButtonVisible(context) {
    if (PersonaLibrary.isWCMOperator(context)) {
        return false;
    }

    return EnableAttachmentCreate(context);
}
