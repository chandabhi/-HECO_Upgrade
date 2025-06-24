import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterCreateUpdateGoodsMovementIsVisible(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }
    
    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return true;
    }
    return false;   
}