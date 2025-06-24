
export default function ServiceOrganizationValue(context) {
    const ServiceOrg = context.binding.ServiceOrg_Nav;
    if (context.binding) {
        return ServiceOrg ? `${ServiceOrg.ShortDescription} ${(ServiceOrg.Description) || ''}` : '-';
    }

    return '-';
}
