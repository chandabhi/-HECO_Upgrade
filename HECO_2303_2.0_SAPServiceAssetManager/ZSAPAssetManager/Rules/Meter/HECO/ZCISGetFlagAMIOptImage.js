export default function ZCISGetFlagAMIOptImage(context) {

    if (context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn == 'I') {
        return 'sap-icon://exit-full-screen';
    } else if (context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn == 'O') {
        return 'sap-icon://full-screen';
    } else if (context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn == 'E') {
        return 'sap-icon://message-error';
    }
}
