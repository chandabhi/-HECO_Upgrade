/**
* Show/Hide Attachment create/edit based on user authorization
* @param {IClientAPI} context
*/
import DocLib from '../../Documents/DocumentLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';

export default function EnableAttachmentCreate(context) {
    if (libPersona.isWCMOperator(context)) {
        return false;
    }

    switch (DocLib.getParentObjectType(context)) {
        case DocLib.ParentObjectType.Equipment:
            return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Attach') === 'Y');
        case DocLib.ParentObjectType.FunctionalLocation:
            return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Attach') === 'Y');
        default: 
            return true;
    }

}
