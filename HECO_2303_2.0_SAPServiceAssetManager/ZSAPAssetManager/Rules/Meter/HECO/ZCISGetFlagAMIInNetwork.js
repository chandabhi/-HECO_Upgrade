export default function ZCISGetFlagAMIInNetwork(context) {
    
    if(context.binding.OrderISULinks && context.binding.OrderISULinks[0].DeviceLocation_Nav.ZFlagAMIInNetwork) {
         return true;
    } else {
        return false;
    }
}
