export default function ZCISGetFlagLifeSupport(context) {
    
    if(context.binding.OrderISULinks && context.binding.OrderISULinks[0].Installation_Nav.ZFlagCustomerLifeSupport) {
         return true;
    } else {
        return false;
    }
}
