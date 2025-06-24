export default function ZCISGetFlagAMIOptVisible(context) {
    
    if(context.binding.OrderISULinks && context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn) {
         return true;
    } else {
        return false;
    }
}
