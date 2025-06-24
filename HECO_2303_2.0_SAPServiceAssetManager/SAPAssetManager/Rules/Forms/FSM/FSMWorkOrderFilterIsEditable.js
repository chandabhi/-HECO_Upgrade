export default function FSMWorkOrderFilterIsEditable(context) {
    return !(context.binding && context.binding.OrderId);
}
