import ComLib from '../../Common/Library/CommonLibrary';
import PersonaLib from '../../Persona/PersonaLibrary';

export default function DocumentOnCreateGetStateVars(context) {
    const DocsDataPageName = ComLib.getStateVariable(context, 'DocsDataPageName');
    const pageName = DocsDataPageName || PersonaLib.getPersonaOverviewStateVariablePage(context);

    if (ComLib.getStateVariable(context, 'operationDocumentCreate')) {
        return {
            DocDescription: ComLib.getStateVariable(context, 'operationDocDescription'),
            Doc: ComLib.getStateVariable(context, 'operationDoc'),
            ObjectLink: ComLib.getStateVariable(context, 'operationObjectLink'),
            Class: ComLib.getStateVariable(context, 'operationClass'),
            ObjectKey: ComLib.getStateVariable(context, 'operationObjectKey'),
            entitySet: ComLib.getStateVariable(context, 'operationentitySet'),
            parentProperty: ComLib.getStateVariable(context, 'operationparentProperty'),
            parentEntitySet: ComLib.getStateVariable(context, 'operationparentEntitySet'),
            attachmentCount: ComLib.getStateVariable(context, 'operationAttachmentCount'),
        };
    }

    return {
        DocDescription: ComLib.getStateVariable(context, 'DocDescription', pageName),
        Doc: ComLib.getStateVariable(context, 'Doc', pageName),
        ObjectLink: ComLib.getStateVariable(context, 'ObjectLink', pageName),
        Class: ComLib.getStateVariable(context, 'Class', pageName),
        ObjectKey: ComLib.getStateVariable(context, 'ObjectKey', pageName),
        entitySet: ComLib.getStateVariable(context, 'entitySet', pageName),
        parentProperty: ComLib.getStateVariable(context, 'parentProperty', pageName),
        parentEntitySet: ComLib.getStateVariable(context, 'parentEntitySet', pageName),
        attachmentCount: ComLib.getStateVariable(context, 'attachmentCount', pageName),
    };
}
