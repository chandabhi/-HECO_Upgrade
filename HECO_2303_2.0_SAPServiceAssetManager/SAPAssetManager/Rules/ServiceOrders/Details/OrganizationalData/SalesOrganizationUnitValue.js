
export default function SalesOrganizationUnitValue(context) {
    const SalesRespOrg = context.binding.SalesRespOrg_Nav;
    if (context.binding) {
        return SalesRespOrg ? `${SalesRespOrg.ShortDescription} ${(SalesRespOrg.Description) || ''}` : '-';
    }

    return '-';
}
