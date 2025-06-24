
import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';
import setFileInfo from './DocumentEditorSetFileInfo';

export default function DocumentEditorSaveAs(context) {
    const pageProxy = context.getPageProxy();
    const container = pageProxy.getControl('FormCellContainer');
    const fileNameCtrl = pageProxy.getControl('FormCellContainer').getControl('FileName');
    const descriptionCtrl = pageProxy.getControl('FormCellContainer').getControl('Description');
    const charLimitInt = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentDescriptionMaximumLength.global').getValue();

    libCom.setInlineControlErrorVisibility(fileNameCtrl, false);
    libCom.setInlineControlErrorVisibility(descriptionCtrl, false);
    container.redraw();

    const fileInfo = getFileInfo(context);
    const fileNameValue = fileNameCtrl.getValue();
    const descriptionValue = descriptionCtrl.getValue();
    let message = '';

    if (fileNameValue.length >= charLimitInt) {
        message = context.localizeText('validation_maximum_file_name_length', [charLimitInt]);
        libCom.setInlineControlError(context, fileNameCtrl, message);
        libCom.setInlineControlErrorVisibility(fileNameCtrl, true);
    } else if (fileNameValue.length === 0) {
        message = context.localizeText('validation_minimum_file_name_length', [1]);
        libCom.setInlineControlError(context, fileNameCtrl, message);
        libCom.setInlineControlErrorVisibility(fileNameCtrl, true);
    } else if (descriptionValue.length >= charLimitInt) {
        message = context.localizeText('validation_maximum_description_length', [charLimitInt]);
        libCom.setInlineControlError(context, descriptionCtrl, message);
        libCom.setInlineControlErrorVisibility(descriptionCtrl, true);
    } else if (descriptionValue.length === 0) {
        message = context.localizeText('validation_minimum_description_length', [1]);
        libCom.setInlineControlError(context, descriptionCtrl, message);
        libCom.setInlineControlErrorVisibility(descriptionCtrl, true);
    } else {
        const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
        const extension = previousPage.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
            setFileInfo(context, {
                FileName: fileNameValue + '.' + fileExt,
                Directory: fileInfo.Directory,
                IsDeleteAllowed: fileInfo.IsDeleteAllowed,
            });
            libCom.setStateVariable(context, 'DocumentEditorDescription', descriptionValue);
            libCom.setStateVariable(context, 'DocumentEditorSaveType', 'SaveAs');
            extension.saveFile(getFileInfo(context));
            context.showActivityIndicator();
        }
        return;
    }
    container.redraw();
}

