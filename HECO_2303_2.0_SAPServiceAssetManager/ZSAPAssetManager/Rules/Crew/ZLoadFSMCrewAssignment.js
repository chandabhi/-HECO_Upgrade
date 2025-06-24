import libCom from '../Common/Library/CommonLibrary';
import ZCrewListItemProcessDisableLoop from './LineItem/ZCrewListItemProcessDisableLoop';
import ZCrewListItemProcessFSMLoop from './LineItem/ZCrewListItemProcessFSMLoop';

export default function ZLoadFSMCrewAssignment(context) {
    
        let fsmCrewHeaderQuery = `$orderby=OriginTimeStamp desc&$filter=Plant ne null and SAPUserName eq '${libCom.getSapUserName(context)}'&$top=1`;
        return context.read('/SAPAssetManager/Services/AssetManager.service','CrewLists',['CrewId'],fsmCrewHeaderQuery).then(fsmHeader => {
            if (fsmHeader && fsmHeader.length > 0) {
                const fsmCrewHeaderRow = fsmHeader.getItem(0);
                const crewMembersQuery = "$orderby=CrewItemKey&$filter=CrewId eq '" + fsmCrewHeaderRow.CrewId + "' and RemovalFlag ne 'X'";
                //Read the old crew members matching the header we found
                return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',[],crewMembersQuery).then(fsmLines => {
                    if (fsmLines && fsmLines.length > 0) {
                        // return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdateInitialize.action').then(function() {

                            let currentCrewQuery =  "$orderby=CrewItemKey&$filter=CrewId eq '" + libCom.getStateVariable(context, 'CrewHeaderCrewId') + "'  and RemovalFlag ne 'X'";
                            return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',[],currentCrewQuery).then(currentCrew => {
                                //Compare incoming FSM assignments to current crew
                                //Curent crew missing from incoming FSM list should be disabled, not deleted to avoid breaking time entry
                                let indexFSM = 0;
                                var newCrew = [];
                                var disableCrew = [];
                                for(let indexCurrent = 0; indexCurrent < currentCrew.length; indexCurrent++) {
                                    let currentLine = currentCrew.getItem(indexCurrent);
                                    let fsmLine = fsmLines.getItem(indexFSM);

                                    //Past FSM list. Disable all remaining current crew
                                    if(fsmLine === undefined || fsmLine.CrewItemKey > currentLine.CrewItemKey) {
                                        disableCrew.push(currentLine); 
                                        continue;
                                    }

                                    //Add new crew. Existing members still added to grab new position
                                    while(indexFSM < fsmLines.length && fsmLine.CrewItemKey <= currentLine.CrewItemKey) {
                                        if(fsmLine.CrewItemKey <= currentLine.CrewItemKey) {
                                            newCrew.push(fsmLine);
                                        }
                                        indexFSM++;
                                        fsmLine = fsmLines.getItem(indexFSM);
                                    }

                                }

                                //If any remaining new FSM crew, add them
                                for(; indexFSM < fsmLines.length; indexFSM++) {
                                    let fsmLine = fsmLines.getItem(indexFSM);
                                    newCrew.push(fsmLine);
                                }

                                return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListUpdateInitialize.action').then(function() {
                                    libCom.setStateVariable(context, 'DisableCrewMembers', disableCrew);
                                    libCom.setStateVariable(context, 'FSMCrewMembers', newCrew);
                                    libCom.setStateVariable(context, 'CrewItemKeyCounter', -1);
        
                                    //Start processing the crew add loop
                                    // return ZCrewListItemProcessDisableLoop(context);
                                    return ZCrewListItemProcessDisableLoop(context).then(() => {
                                        libCom.setStateVariable(context, 'CrewItemKeyCounter', -1);
                                        return ZCrewListItemProcessFSMLoop(context);
                                    });
                                });
                                
                            });
                        // });
                    } else {
                        return Promise.resolve(true);
                    }
                });
            }
            return Promise.resolve(true);
        });
}
