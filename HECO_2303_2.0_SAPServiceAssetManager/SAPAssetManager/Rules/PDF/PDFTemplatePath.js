import libVal from '../Common/Library/ValidationLibrary';
import GetHTMLPath from '../Documents/GetHTMLPath';
import Logger from '../Log/Logger';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import libPersona from '../Persona/PersonaLibrary';

export default function PDFTemplatePath(context) {
    const serviceName = '/SAPAssetManager/Services/AssetManager.service';
    const S4ServiceIntegrationGlobal = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceData.global').getValue();
    const CSServiceOrderGlobal = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceData.global').getValue();
    const PMWorkOrderGlobal = context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue();
    const isS4ServiceEnabled = IsS4ServiceIntegrationEnabled(context);
    return context.read(serviceName, 'ReportTemplates', [], '$expand=Document_Nav').then(results => {
        if (!libVal.evalIsEmpty(results)) {
            const featureId = libPersona.isMaintenanceTechnician(context) ? PMWorkOrderGlobal : (isS4ServiceEnabled ? S4ServiceIntegrationGlobal : CSServiceOrderGlobal);
            const template = results.find(result => result.FeatureID === featureId);

            if (!libVal.evalIsEmpty(template)) {
                return GetHTMLPath(context, template.Document_Nav).then((path) => {
                    return path;
                }).catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/PDF/PDFRenderFailureBannerMessage.action');
                });
            } else {
                Logger.error('SERVICE REPORT', 'Failed to find the template');
            }
        } else {
            Logger.error('SERVICE REPORT', 'Failed to find the template');
        }
        return Promise.resolve();
    });
}
