export default function ZCISIsMeterOrder(context) {
    
    let orderType;
    //Determine if being used as visibility rule or check during other function
    //Visibility rule will pass context with binding, while function checks will directly pass the value
    if(context.binding && context.binding.OrderType) {
        orderType = context.binding.OrderType;
    }else {
        orderType = context;
    }

    if (orderType == 'ZSMO' ||
        orderType == 'ZMRO' ||
        orderType == 'ZREC' ||
        orderType == 'ZDIS') {
            return true;
        } else {
            return false;
        }
}
