import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemProductDescriptionValue(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Product_Nav && binding.Product_Nav.Description);
}
