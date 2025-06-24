import ruleEvaluator from './FSMFormFieldOnValueChange';
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';
import NativeScriptObject from '../../Common/Library/NativeScriptObject';

export default function FSMFormOnPageLoad(context) {
    //Create attachmentEntry if applicable
    initializeAttachmentPicker(context);
    libCom.removeStateVariable(context, 'AttachmentDescriptions');

    let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let chapters = libCom.getStateVariable(context, 'FSMFormInstanceChapters');

    //Remove state variables used for visibility rule evaluation
    libCom.removeStateVariable(context, 'FSMVisibilityNeedsFocus');
    libCom.removeStateVariable(context, 'FSMVisibilityNeedsPickerRefresh');

    ruleEvaluator(context, true); //Run all visibility and calculation rules when loading a new form chapter to set initial control states
    if (chapters[currentChapterIndex].state === 3) { //Validation caught errors during submit
        libForms.ValidateCurrentPageValues(context); //Highlight error fields
    }
}

/**
 * Helper function to initialize the attachment picker if need be
 * @param {*} context
 */
function initializeAttachmentPicker(context) {
    //Initalize controls
    let sectionedTableProxy = context.getPageProxy().getControls()[0];
    let pageControls = sectionedTableProxy._control.controls;

     //Initalize constants
     const entitySet = 'FSMFormAttachments';
     const property = 'FSMFormAttachment';
     const service = '/SAPAssetManager/Services/AssetManager.service';

     //state Variable holding names of attachments
     let stateDescription = libCom.getStateVariable(context, 'AttachmentDescriptions');

     //Create attachments
    for (let x = 0; x < pageControls.length; x++) {
        if (pageControls[x].getType() === 'Control.Type.FormCell.Attachment') {
            let attachmentData = [];
            let attachmentValue = pageControls[x].getValue();
            for (let y = 0; y < attachmentValue.length; y++) {
                //Check to see if attachment exists locally
                if (libForms.ifMediaExist(attachmentValue[y])) {
                    //attachment exists locally so create attachmentEntry
                    let readLink = 'FSMFormAttachments(\'' + attachmentValue[y] + '\')';
                    let tempFolder = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.knownFolders.temp();
                    var imageLocalPath = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.path.join(tempFolder.path, attachmentValue[y], stateDescription[attachmentValue[y]]);
                    let attachmentProxy = pageControls[x].controlProxy;
                    let attachmentEntry = attachmentProxy.createAttachmentEntry(imageLocalPath, entitySet, property, readLink, service);
                    if (attachmentEntry) {
                        attachmentData.push(attachmentEntry);
                    }
                }
            }
            //Set Attachments
            if (attachmentData.length !== 0) {
                pageControls[x].setValue(attachmentData).then(() => {
                    pageControls[x].redraw();
                });
            }
        }
    }
}
