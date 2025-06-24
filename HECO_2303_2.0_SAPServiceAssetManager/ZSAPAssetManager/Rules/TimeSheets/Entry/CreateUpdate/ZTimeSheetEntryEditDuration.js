
export default function ZTimeSheetEntryEditDuration(context) {

    let wageType = context.binding.ZWageType;

    //HECO
    //If wagetype is picked, enable duration entry
    if (wageType) {
     return true;
    } else {
        return false;
    }

}
