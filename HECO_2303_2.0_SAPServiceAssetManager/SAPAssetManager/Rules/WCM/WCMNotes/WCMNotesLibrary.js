export default class WCMNotesLibrary {

    static getTextTypeBySection(context, sectionName) {
        const name = sectionName || context.getName();

        switch (name) {
            case 'RequalificationTextSection':
                return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RequalificationText.global').getValue();
            case 'TaggingTextSection':
                return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/TaggingText.global').getValue();
            case 'UntaggingTextSection':
                return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/UntaggingText.global').getValue();
            case 'RejectionTextSection':
                return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RejectionText.global').getValue();             
            default:
                return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/LongText.global').getValue();        
        }
    }

    static isNoteSectionVisible(context) {
        const name = context.getName();
        const entityType = context.getPageProxy().binding['@odata.type'];

        switch (name) {
            case 'RequalificationTextSection':
                return entityType !== context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue();
            case 'TaggingTextSection':
            case 'UntaggingTextSection':
                return entityType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue();           
            default:
                return true;        
        }
    }

    static getNotesEntitySet(context) {
        const readLink = context.binding['@odata.readLink'];
        const entityType = context.binding['@odata.type'];
        let navLink;

        switch (entityType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue():
                navLink = 'WCMDocumentHeaderLongtexts';
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue():
                navLink = 'WCMApprovalLongtexts';
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
                navLink = 'WCMApplicationLongtext_Nav';
                break;        
        }

        return `${readLink}/${navLink}`;
    }

    static getNoteCaption(context, textType) {
        const type = textType || this.getTextTypeBySection(context);

        switch (type) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RequalificationText.global').getValue():
                return context.localizeText('requalification_text');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/TaggingText.global').getValue():
                return context.localizeText('tagging_text');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/UntaggingText.global').getValue():
                return context.localizeText('untagging_text');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RejectionText.global').getValue():
                return context.localizeText('rejection_text');             
            default:
                return context.localizeText('long_text');        
        }
    }

    static getNoteQueryOptions(context, sectionName) {
        return `$filter=TextType eq '${this.getTextTypeBySection(context, sectionName)}'`;
    }
}
