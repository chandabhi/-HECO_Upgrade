export default function ZCISGetFlagHostile(context) {
    
    if(context.binding.OrderISULinks && context.binding.OrderISULinks[0].Installation_Nav.ZFlagCustomerHostile) {
         return true;
    } else {
        return false;
    }
}
