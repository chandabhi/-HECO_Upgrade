
export default function ServiceOrganizationUnitValue(context) {
    const ServiceRespOrg = context.binding.ServiceRespOrg_Nav;
    if (context.binding) {
        return ServiceRespOrg ? `${context.binding.ServiceOrg_Nav && context.binding.ServiceOrg_Nav.ShortDescription} ${(ServiceRespOrg.Description) || ''}` : '-';
    }

    return '-';
}
