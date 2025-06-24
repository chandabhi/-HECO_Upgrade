export default function FollowOnNotificationsQueryOptions(context) {
    return `$filter=RefObjectKey eq '${context.binding.OrderId}'&$orderby=Priority desc`;   
}
