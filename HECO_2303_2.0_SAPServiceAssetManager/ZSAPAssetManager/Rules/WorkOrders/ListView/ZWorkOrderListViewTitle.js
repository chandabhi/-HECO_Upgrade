import ZCISIsMeterOrder from "../../Meter/HECO/ZCISIsMeterOrder";

export default function ZWorkOrderListViewTitle(context) {
    //HECO
    //CIS orders should show service address
    
    let title = context.binding.OrderDescription;
    if(ZCISIsMeterOrder(context.binding.OrderType)) {
        title = title + ' - ' + context.binding.ZWorkServiceAddress;
    }
    return title;
}
