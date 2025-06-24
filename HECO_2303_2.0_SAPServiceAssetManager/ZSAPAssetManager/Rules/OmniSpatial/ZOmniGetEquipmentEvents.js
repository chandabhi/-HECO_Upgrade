
export default function ZOmniGetEquipmentEvents(context) {

  //Add actions to Esri layers in Omni
  //Documentation https://docs.omni.rizing.app/docs/extensibility/events/apply-overrides-event

  let equipActions =
  {
    source: "SAM",
    eventName: "apply-overrides",
    data:
    {
      layers: {
        '*': {
          filter: {hasField: 'SAP_EQUIPID'},
          actionsInfo: {
            actions: [
              {
                title: 'Create Notif',
                type: 'native-script-event',
                eventName: 'EquipmentCreateNotif'
              }
            ]
          }
        }
      },
    }
  };

  return equipActions;

}