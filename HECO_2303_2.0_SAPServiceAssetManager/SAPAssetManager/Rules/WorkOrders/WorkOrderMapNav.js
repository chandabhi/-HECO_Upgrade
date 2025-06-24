import GetGeometryInformation from '../Common/GetGeometryInformation';
import libEval from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import personalLib from '../Persona/PersonaLibrary';
import AddressMapValue from '../Maps/AddressMapValue';

export default function WorkOrderMapNav(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        let address = context.binding.address;
        if (address) {
            context.getPageProxy().setActionBinding(context.binding);
            return context.executeAction('/SAPAssetManager/Actions/Extensions/FSMS4ServiceOrderMapNav.action');
        } else {
            return AddressMapValue(context).then(()=> {
                address = context.binding.address;
        
                if (address) {
                    context.getPageProxy().setActionBinding(context.binding);
                    return context.executeAction('/SAPAssetManager/Actions/Extensions/FSMS4ServiceOrderMapNav.action');
                } else {
                    return Promise.resolve();
                }
            });
        }
    }

    const geometry = context.getBindingObject().geometry;

    if (geometry && Object.keys(geometry).length > 0) {
        // If this is a valid Work Order, navigate immediately
        if (personalLib.isFieldServiceTechnician(context)) {
            context.getPageProxy().setActionBinding(context.binding);
            return context.executeAction('/SAPAssetManager/Actions/Extensions/FSMServiceOrderMapNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action');
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'AddressDetSequences', [], `$filter=PMObjectType eq '${context.binding.OrderType}'&$orderby=SequenceNo asc`).then(function(val) {
        libCom.setStateVariable(context, 'sequences', val);
        return GetGeometryInformation(context.getPageProxy(), 'WOPartners').then(function(value) {
            if (libEval.evalIsEmpty(value)) {
                // create
                return libCom.getPageName(context) === 'WorkOrderCreateUpdatePage' ? context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapCreateNav.action') : null;
            }

            context.getPageProxy().setActionBinding(value);
            if (value['@odata.type']=== '#sap_mobile.MyFunctionalLocation' && !libEval.evalIsEmpty(value.FuncLocGeometries) && value.FuncLocGeometries[0].Geometry) {
                return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationMapNav.action');
            }
            if (value['@odata.type']=== '#sap_mobile.MyEquipment' && !libEval.evalIsEmpty(value.EquipGeometries) && value.EquipGeometries[0].Geometry) {
                return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentMapNav.action');
            }
            // update
            if (libCom.getPageName(context) === 'WorkOrderCreateUpdatePage') {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapUpdateNav.action');
            }
            return !libEval.evalIsEmpty(value.WOGeometries) ? context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action') : null;
        });
    });
}
