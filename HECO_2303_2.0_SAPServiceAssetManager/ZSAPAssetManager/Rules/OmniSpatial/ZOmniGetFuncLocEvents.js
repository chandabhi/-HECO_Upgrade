
export default function ZOmniGetFuncLocEvents(context) {

  //Add actions to Esri layers in Omni
  //Documentation https://docs.omni.rizing.app/docs/extensibility/events/apply-overrides-event

  let funcLocActions =
  {
    source: "SAM",
    eventName: "apply-overrides",
    data:
    {
      layers: {
        '*': {
          $filter: { hasField: 'LOC_ID' },
          actionsInfo: {
            actions: [
              {
                title: 'Create Notif',
                type: 'native-script-event',
                eventName: 'FuncLocCreateNotif'
              }
            ]
          }
        }
      },
    }
  };

  return funcLocActions;

}