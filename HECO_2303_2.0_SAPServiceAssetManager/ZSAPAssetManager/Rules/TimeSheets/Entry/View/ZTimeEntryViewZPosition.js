export default function ZTimeEntryViewZPosition(context) {
    let binding = context.getPageProxy().binding;

    if (binding.ZPosition) {
        return binding.ZPosition
    }
    return '-';
}
