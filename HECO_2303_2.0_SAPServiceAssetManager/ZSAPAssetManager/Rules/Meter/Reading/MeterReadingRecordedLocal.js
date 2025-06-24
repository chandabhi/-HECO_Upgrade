import meterReading from './MeterReadingRecorded';
import libMeter from '../Common/MeterLibrary';

export default function MeterReadingRecordedLocal(context) {
    //HECO Default in meter read to 0
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if(meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return 0;
    } else {
        return meterReading(context, true); //Pass the local only parameter
    }
}
