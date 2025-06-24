
export default function ZTimeSheetEntryEditStartTime(context) {
    let startDate = new Date(context.binding.Date);
    startDate.setHours(context.binding.StartTime.substring(0,2));
    startDate.setMinutes(context.binding.StartTime.substring(3,5));
    return startDate;
}
