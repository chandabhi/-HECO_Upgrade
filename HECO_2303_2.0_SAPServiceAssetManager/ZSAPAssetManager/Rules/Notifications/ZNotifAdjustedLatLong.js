
export default function NotificationLocationFormat(context) {
    if (context.binding.ZAdjustedObjectLatitude && context.binding.ZAdjustedObjectLongitude ) {
        return context.binding.ZAdjustedObjectLatitude + ' / ' + context.binding.ZAdjustedObjectLongitude;
    } else {
        return '-';
    }
}
