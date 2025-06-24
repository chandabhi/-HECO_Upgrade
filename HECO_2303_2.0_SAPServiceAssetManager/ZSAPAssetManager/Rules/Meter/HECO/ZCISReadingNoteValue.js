import libMeter from '../Common/MeterLibrary';

export default function ZCISReadingNoteValue(context) {
    let procType = '';
    switch (libMeter.getMeterTransactionType(context)) {
        case 'INSTALL':
        case 'INST':
            procType = 'INST';
            break;
        case 'REP_INST':
        case 'REPLACE':
            procType = 'REPL';
            break;
        case 'REMOVE':
            procType = 'REMV';
            break;
        case 'DISCONNECT':
        default:
            break;
    }
    return procType;
}
