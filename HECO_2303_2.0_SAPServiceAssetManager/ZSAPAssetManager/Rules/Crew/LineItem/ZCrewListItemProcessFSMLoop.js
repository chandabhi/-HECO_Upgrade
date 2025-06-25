import libCom from "../../Common/Library/CommonLibrary";

//Disable all crew not assigned to incoming FSM crew list
export default function ZCrewListItemProcessFSMLoop(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    const crew = libCom.getStateVariable(context, 'FSMCrewMembers');
    let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
    counter++;
    if (counter === crew.length) { //We are done processing rows
        context.redraw();
        return Promise.resolve(true);
    } else { //Process row
        libCom.setStateVariable(context, 'CrewItemKeyCounter', counter);

        return context.read('/SAPAssetManager/Services/AssetManager.service','Employees',[],"$filter=PersonnelNumber eq '" + crew[counter].CrewItemKey + "'").then(employees => {
            if (employees && employees.length > 0 ) {
                let crewMemberQuery = "$orderby=CrewItemKey&$filter=CrewId eq '" + libCom.getStateVariable(context, 'CrewHeaderCrewId') + "' and CrewItemKey eq '" + crew[counter].CrewItemKey + "'";
                return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',[],crewMemberQuery).then(result => {
                    if (result && result.length > 0 ) {
                        //If crew entry already exists, re-enable
                        return context.executeAction('/ZSAPAssetManager/Actions/Crew/ZCrewListItemFSMEnable.action');
                        
                    } else {
                        return context.executeAction('/ZSAPAssetManager/Actions/Crew/ZCrewListItemFSMAdd.action');
                    }
                });
            } else {
                ZCrewListItemProcessFSMLoop(context);
            }
    });
    }
}
