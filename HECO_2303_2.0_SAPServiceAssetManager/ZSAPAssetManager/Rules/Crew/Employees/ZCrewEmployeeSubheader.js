export default function ZCrewEmployeeSubheader(context) {

    var subheader = context.binding.Employee.PersonnelNumber
    if(context.binding.ZPositionID) {
        return context.read('/SAPAssetManager/Services/AssetManager.service','ZEmployeePositions',[],"$filter=ZPositionID eq '" + context.binding.ZPositionID + "'").then(result => {
            if (result && result.length > 0 ) {
                let zPos = result.getItem(0);
                let posId = zPos.ZPositionID.replace(/^0+/, ''); //Remove leading 0s
                subheader = subheader + " - " + posId + " - " + zPos.ZPositionDesc;
            }
            return subheader;
        });
    } else {
        return subheader;
    }
}
