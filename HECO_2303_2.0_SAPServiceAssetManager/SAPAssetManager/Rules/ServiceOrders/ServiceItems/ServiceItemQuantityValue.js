import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemQuantityValue(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Quantity);
}
