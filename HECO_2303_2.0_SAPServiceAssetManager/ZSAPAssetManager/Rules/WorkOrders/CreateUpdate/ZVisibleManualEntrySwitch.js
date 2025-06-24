//Logic to enable toggle button for edit scenario
export default async function ZVisibleManualEntrySwitch(context) {
    let CatsTimsheet = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=MyWOHeader');
    return CatsTimsheet.getItem(0)?.ZWageType === "1104"||Boolean(CatsTimsheet.getItem(0)?.AttendAbsenceType) || false;
}