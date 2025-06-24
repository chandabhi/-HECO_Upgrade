export default function ZWorkOrderMRUSequence(context) {
    //WorkOrderDetailsPage label for Meter Reading Unit and Sequence
    if(context.binding.ZMeterReadingUnit) {
        return context.binding.ZMeterReadingUnit + ' / ' + context.binding.ZMeterSequenceNum;
    } else {
        return '-';
    }
}
