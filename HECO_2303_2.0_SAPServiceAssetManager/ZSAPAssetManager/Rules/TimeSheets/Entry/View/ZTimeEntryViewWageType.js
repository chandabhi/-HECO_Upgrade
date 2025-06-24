
export default function ZTimeEntryViewWageType(context) {
    let wageType = '';

    if (context.constructor.name === 'SectionedTableProxy') {
        wageType = context.binding.ZWageType;
    } else {
        wageType = context.getPageProxy().binding.ZWageType;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ZEmployeeWageTypes', [], `$filter=zWageType eq '${wageType}'`).then(result => {
        if (!result || result.length === 0) {
            return '-';
        }
        let employeeWage = result.getItem(0);
        return employeeWage.zWageType + ' - ' + employeeWage.zLongText;
    });
}
