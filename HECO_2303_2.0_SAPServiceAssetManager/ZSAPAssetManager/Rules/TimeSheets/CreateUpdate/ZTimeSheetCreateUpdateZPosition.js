import libCom from "../../Common/Library/CommonLibrary";

export default function ZTimeSheetCreateUpdateZPosition(context)
{
    try {

        let wagePicker = libCom.getTargetPathValue(context, '#Control:ZEmployeePositionLstPkr/#Value');
        return libCom.getListPickerValue(wagePicker);
        
    }
    catch (error) { //Control doesn't exist
        return "";
    }

    // let crewMemberQuery =  "$orderby=CrewItemKey&$filter=CrewId eq '" + libCom.getStateVariable(context, 'CrewHeaderCrewId') + "' and CrewItemKey eq '" + libCom.getStateVariable(context, 'ZCrewPernr') + "'";
    // return context.read('/SAPAssetManager/Services/AssetManager.service','CrewListItems',[],crewMemberQuery).then(result => {
    //     if (result && result.length > 0 ) {
    //         //If crew entry already exists, re-enable
    //         let crewMember = result.getItem(0);
    //         if(crewMember.ZPositionID) {
    //             return crewMember.ZPositionID;
    //         } else {
    //             return '';
    //         }
    //     }
    // });
    // // let ZPosition = libCom.getTargetPathValue(context, '#Control:ZEmployeePositionLstPkr/#Value');
    // // return libCom.getListPickerValue(ZPosition);
}
