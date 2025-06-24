export default function ZCISGetFlagAMIOptLabel(context) {
    
    if (context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn == 'I') {
        return 'Opt-In';
    } else if (context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn == 'O') {
        return 'Opt-Out';
    } else if (context.binding.OrderISULinks[0].Installation_Nav.ZFlagAMIOptIn == 'E') {
        return 'Opt In/Out Error’';
    }
}
