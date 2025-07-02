import notifCreateChangeSetNav from '../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav';
import libCom from '../Common/Library/CommonLibrary';
export default function ZOmniNotificationCreateFromFuncLoc(context, funcLocId)
{   
    let pageProxy = context.getPageProxy();
    let query = `$filter=FuncLocIdIntern eq '${funcLocId}'`;
    // return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=Operations/OperationLongText&$filter=OrderId eq '${orderId}'`)
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], query).then(function (result)
    {
        if (result && result.length > 0) { 
            //FuncLoc exists on device, execute normally
            let funcLoc = result.getItem(0);
            let bindingObject = {
                HeaderEquipment: null,
                HeaderFunctionLocation: funcLoc.FuncLocIdIntern,
                ExternalWorkCenterId: funcLoc.MaintWorkCenter,
                MainWorkCenterPlant: funcLoc.MaintPlant,
                OperationOrderId: null,
            };
            return notifCreateChangeSetNav(context, bindingObject);
        } else {
            //FuncLoc is not present on device. 
            libCom.setStateVariable(context, 'OmniSelectedFuncLoc', funcLocId);
            return notifCreateChangeSetNav(context);
        }
    });



}