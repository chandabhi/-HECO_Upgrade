import libCom from "../../Common/Library/CommonLibrary";

export default function ZTimeSheetEditZPosition(context)
{
    let ZPosition = libCom.getTargetPathValue(context, '#Control:ZEmployeePositionLstPkr/#Value');
    return libCom.getListPickerValue(ZPosition);
}
