import libCom from "../../Common/Library/CommonLibrary";

//Disable all crew not assigned to incoming FSM crew list
export default function ZCrewListItemProcessDisableLoop(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    const crew = libCom.getStateVariable(context, 'DisableCrewMembers');
    let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
    counter++;
    if (counter === crew.length) { //We are done processing rows
        return Promise.resolve(true);
    } else { //Process row
        libCom.setStateVariable(context, 'CrewItemKeyCounter', counter);
        return context.executeAction('/ZSAPAssetManager/Actions/Crew/ZCrewListItemDisable.action');
    }
}
