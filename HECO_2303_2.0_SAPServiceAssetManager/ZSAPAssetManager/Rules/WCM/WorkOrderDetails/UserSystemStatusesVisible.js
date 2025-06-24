import libPersona from '../../Persona/PersonaLibrary';
export default function WorkOrderDetailsPageMetadata(clientAPI) {
    if (libPersona.isWCMOperator(clientAPI)) { 
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrderDetails.page');
    let sections = page.Controls[0].Sections;
    let NewSections = sections.filter(obj=> { 
            return obj._Name !== 'UserSystemStatuses'; 
        },
    );
    page.Controls[0].Sections = NewSections;
    return page;
    }
}
