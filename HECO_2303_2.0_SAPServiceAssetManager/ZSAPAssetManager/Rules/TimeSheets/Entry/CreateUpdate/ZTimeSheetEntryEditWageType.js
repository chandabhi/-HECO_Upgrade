
export default function ZTimeSheetEntryEditWageType(context) {

    let wageType = context.binding.ZWageType;

    //Overclassification position is allowed for the following wage types
    if (wageType == ''
    || wageType == '1104'
    || wageType == '1114'
    || wageType == '1115'
    || wageType == '1116'
    || wageType == '1117'
    || wageType == '1134'
    || wageType == '1135'
    || wageType == '1136'
    || wageType == '1158'
    || wageType == '2007') {
     return true;
    } else {
        return false;
    }

}
