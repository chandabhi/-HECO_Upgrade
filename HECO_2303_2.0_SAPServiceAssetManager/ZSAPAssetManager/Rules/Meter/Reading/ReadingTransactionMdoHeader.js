import libMeter from '../../Meter/Common/MeterLibrary';

export default function ReadingTransactionMdoHeader(context) {
    if (context.binding.ErrorObject) {
        for (let idx = 0; idx < context.binding.ErrorObject.CustomHeaders.length; idx ++) {
            let obj = context.binding.ErrorObject.CustomHeaders[idx];
            if (obj.Name === 'transaction.omdo_id') {
                return obj.Value;
            }
        }
        return 'SAM2305_METER_READING';
    } else {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        if (meterTransactionType.startsWith('INSTALL') || meterTransactionType.startsWith('REMOVE') || meterTransactionType.startsWith('REPLACE') || meterTransactionType.startsWith('REP_INST')) {
            return 'SAM2305_DEVICE';
        } else if (meterTransactionType.startsWith('PERIODIC')) {
            return 'SAM2305_MR_PERIODIC';
        }
        return 'SAM2305_METER_READING';
    }
}
