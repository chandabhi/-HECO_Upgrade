import ZOmniWorkOrderDetailsNav from './ZOmniWorkOrderDetailsNav';
import ZOmniWorkOrderOperationsDetailsNav from './ZOmniWorkOrderOperationsDetailsNav';
import ZOmniLoadMapData from './ZOmniLoadMapData';
import ZOmniNotificationCreateFromFuncLoc from './ZOmniNotificationCreateFromFuncLoc';

//OmniSpatial
//Listeners are triggered by OmniSpatial on the Nativescript interface implemented by Omni
export default function ZOmniSetupListeners(context, webViewExt)
{
  //WorkOrder events
  webViewExt.addEventListener("ViewWorkOrder", args =>
  {
    console.log(`webViewExtEvent: ViewWorkOrder ${args.data.feature.attributes.OrderId}`);
    ZOmniWorkOrderDetailsNav(context, args.data.feature.attributes.OrderId);
    // ZOmniWorkOrderOperationsDetailsNav(context, args.data.feature.attributes.OrderId);
  });

  //Equipment events
  webViewExt.addEventListener("ViewEquipment", args =>
  {
    console.log(`webViewExtEvent: ViewEquipment ${args.data.feature.attributes.SAP_EQUIP_ID}`);
    // ZEquipmentDetailsNavFromOmni(context, args.data.feature.attributes.SAP_EQUIP_ID);
  });
  webViewExt.addEventListener("EquipmentCreateNotif", args =>
  {
    console.log("webViewExtEvent: EquipmentCreateNotif " + args.data.feature.attributes.SAP_EQUIP_ID);
    // ZNotificationCreationFromOmni(context, args.data.feature.attributes.SAP_EQUIP_ID)
  });
  webViewExt.addEventListener("FuncLocCreateNotif", args =>
  {
    console.log("webViewExtEvent: FuncLocCreateNotif " + args.data.feature.attributes.LOC_ID);
    if(args.data.feature.attributes.LOC_ID) {
      ZOmniNotificationCreateFromFuncLoc(context, args.data.feature.attributes.LOC_ID);
    }
    // ZNotificationCreationFromOmni(context, args.data.feature.attributes.SAP_EQUIP_ID)
  });


  //Initial map load event
  webViewExt.addEventListener("app-ready", args =>
  {
    console.log("webViewExtEvent: app-ready");

    ZOmniLoadMapData(context);
  });




}