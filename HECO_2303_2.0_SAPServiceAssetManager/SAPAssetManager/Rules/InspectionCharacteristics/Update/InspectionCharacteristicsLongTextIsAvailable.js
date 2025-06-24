
export default function InspectionCharacteristicsLongTextIsAvailable(context) {
    let binding = context.binding;

    if (binding && binding.MasterInspCharLongText_Nav && binding.MasterInspCharLongText_Nav.TextString) {
        return true;
    }

    return false;
}
