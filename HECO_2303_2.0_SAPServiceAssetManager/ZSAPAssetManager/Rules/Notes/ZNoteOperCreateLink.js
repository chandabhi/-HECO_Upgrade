import CommonLibrary from "../Common/Library/CommonLibrary";

// This is needed as the default NoteCreateLink rule will pick up the Operation Link and not the Notification
export default async function ZNoteOperCreateLink(context) {

    //let operHold = CommonLibrary.getStateVariable(context, 'ZOperationHold');
    let NotificationNumber = context.binding.WOHeader.NotificationNumber; //operHold.WOHeader.NotificationNumber; 
    var createLinks = [];
    let query = `$filter = NotificationNumber eq '${NotificationNumber}'`
    let result = await context.read('/SAPAssetManager/Services/AssetManager.service',"MyNotificationHeaders",[], query);
    let readLink=result.getItem(0)['@odata.readLink']
    let noteCreateLink = context.createLinkSpecifierProxy('Notification', 'MyNotificationHeaders', '', readLink);
    createLinks.push(noteCreateLink.getSpecifier());
    return createLinks;


    //return NoteLib.createLinks(context);
}
