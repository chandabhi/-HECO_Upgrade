export default function InspectionLotAccessoryType(context) {
    let binding = context.binding;
    let status = binding.InspectionLot_Nav.SystemStatus;
    if (usageDecisionPending(binding.InspectionLot_Nav) || checkAnyInspectionCharIsLocal(binding)) {
        if (!status.startsWith('UD') || binding.InspectionLot_Nav['@sap.isLocal'] || checkAnyInspectionCharIsLocal(binding)) {
            return 'detailButton';
        }
    }
    return 'none';
}

/**
 * Determines whether or not a usage decision is pending or not recorded
 * This can be one or more of the following:
 * 1. Inspection Lot has no Usage Decision -- UDCatalog, UDCode, UDCodeGroup, and UDSelectedSet are all blank
 * 2. Inspection Lot has a Usage Decision set, but is still local
 * @param {Object} binding Inspection Lot binding
 * @returns {Boolean} true if usage decision is pending, false if otherwise
 */
function usageDecisionPending(binding) {
    if (binding.UDCatalog === '' && binding.UDCode === '' && binding.UDCodeGroup === '' && binding.UDSelectedSet === '') {
        return true;
    } else {
        if (binding['@sap.isLocal']) {
            return true;
        } else {
            return false;
        }
    }
}

function checkAnyInspectionCharIsLocal(binding) {
    if (binding && binding.InspectionLot_Nav && binding.InspectionLot_Nav.InspectionChars_Nav) {
        for (let index=0; index < binding.InspectionLot_Nav.InspectionChars_Nav.length; index++) {
            if (binding.InspectionLot_Nav.InspectionChars_Nav[index]['@sap.isLocal']) {
                return true;
            }
        }
        return false;
    }
    return false;
}
