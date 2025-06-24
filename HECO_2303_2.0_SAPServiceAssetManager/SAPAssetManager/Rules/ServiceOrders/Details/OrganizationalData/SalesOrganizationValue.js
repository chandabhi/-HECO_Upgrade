
export default function SalesOrganizationValue(context) {
    const SalesOrg = context.binding.SalesOrg_Nav;
    if (context.binding) {
        return SalesOrg ? `${SalesOrg.ShortDescription} ${(SalesOrg.Description) || ''}` : '-';
    }

    return '-';
}
