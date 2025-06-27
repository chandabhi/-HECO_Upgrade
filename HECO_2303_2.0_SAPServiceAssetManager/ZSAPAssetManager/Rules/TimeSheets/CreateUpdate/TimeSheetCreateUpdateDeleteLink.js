import libCom from '../../Common/Library/CommonLibrary';
import valLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';

export default function TimeSheetCreateUpdateDeleteLink(pageProxy) {
    var links = [];
    var subOpReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));

    if (subOpReadLink === '' && !valLibrary.evalIsEmpty(pageProxy.binding.MyWOSubOperation)) {
        links.push({
            'Property': 'MyWOSubOperation',
            'Target':
            {
                'EntitySet': 'MyWorkOrderSubOperations',
                'ReadLink': pageProxy.binding.MyWOSubOperation['@odata.readLink'],
            },
        });
    }
    if(pageProxy.getControls('FormCellContainer')[0]?.getControl('ManualOrderSwitch')?.getValue()===true&&pageProxy.binding.MyWOHeader&&pageProxy.binding.MyWOOperation&&pageProxy.getControls('FormCellContainer')[0]?.getControl('ManualCostCenterInput')?.getValue()){
        links = [
            {
                'Property': 'MyWOHeader',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderHeaders',
                    "QueryOptions": `$filter=OrderId eq '${pageProxy.binding.MyWOHeader.OrderId}'`,
                    // 'ReadLink': pageProxy.binding.MyWOHeader['@odata.readLink'],
                    
                },
            },
            {
                'Property': 'MyWOOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderOperations',
                    "QueryOptions": `$filter=OperationNo eq '${pageProxy.binding.MyWOOperation.OperationNo}'`,
                    // 'ReadLink': pageProxy.binding.MyWOOperation['@odata.readLink'],
                },
            }]
    }
    return links;
}
