import libCom from "../Common/Library/CommonLibrary";
export default function ZNoteCopyOperNoteLinks(context) {

    let operCompleteNote = libCom.getStateVariable(context, 'ZOperationCompleteNote');

    let links = [
        {
            'Property': 'WorkOrderHeader',
            'Target':
            {
                'EntitySet': 'MyWorkOrderHeaders',
                'QueryOptions': `$filter=OrderId eq '${operCompleteNote.orderId}'`,
            },
        }];

    return links;
}
