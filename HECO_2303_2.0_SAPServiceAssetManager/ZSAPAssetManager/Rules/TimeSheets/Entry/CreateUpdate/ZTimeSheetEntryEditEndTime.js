
export default function ZTimeSheetEntryEditEndTime(context) {
    let endDate = new Date(context.binding.Date);
    endDate.setHours(context.binding.EndTime.substring(0,2));
    endDate.setMinutes(context.binding.EndTime.substring(3,5));
    return endDate;
}
