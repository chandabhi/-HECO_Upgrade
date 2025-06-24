import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import updateHeaderCountItems from '../InboundOrOutbound/UpdateHeaderCountItems';

export default function IssueAllWrapper(context) {

    let messageText = context.localizeText('issue_all_warning');
    let captionText = context.localizeText('warning');

    //Prompt user with issue all warning dialog
    return libCom.showWarningDialog(context, messageText, captionText).then(result => {
        if (result === true) {
            //Figure out binding properties
            libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink','');
            libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber','');
            libCom.removeStateVariable(context, 'IssueAllItemId');

            context.binding.TempHeader_DocumentDate = '';
            context.binding.TempHeader_HeaderText = '';
            context.binding.TempHeader_DeliveryNote = '';

            libCom.removeStateVariable(context, 'CancelActionFlag');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ReceiptReceiveAllCreateChangeset.action').then(() => {
                if (!libCom.getStateVariable(context, 'CancelActionFlag')) {
                    return updateHeaderCountItems(context).then((status) => {
                        try {
                            let pageName = libCom.getPageName(context);
                            if (status) { //Refresh the RES/STO/PRD details page
                                context.binding.DocumentStatus = status;                        
                                context.getPageProxy().getControl('SectionedTable').getSection('SectionObjectHeader').redraw(true);
                                libCom.enableToolBar(context, pageName, 'IssuePartTbI', false);
                            } else if (libCom.getStateVariable(context, 'IMObjectType') === 'PRD') {
                                libCom.enableToolBar(context, pageName, 'IssuePartTbI', false);
                            }
                        } catch (err) {
                            Logger.error('IssueAllWrapper', err);
                        } finally {
                            libCom.removeStateVariable(context, 'CancelActionFlag');
                        }
                        return true;
                    });
                }
                return true;
            });
        }
        return false;
    }).catch(function() {
        return false; //User terminated out of warning dialog
    });
}
