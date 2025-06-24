
export default function MainRefObjectFlagValue(context) {
    return context.binding.MainObject === 'X' ? '$(L,yes)' : '$(L,no)';
}
