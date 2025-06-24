import ApprovalStatusFilterItems from './ApprovalStatusFilterItems';

export default function ApprovalStatusText(context) {
    const trafficLight = ApprovalStatusFilterItems(context).values.find(i => i.ReturnValue.toString() === context.binding.TrafficLight.toString());
    return trafficLight ? trafficLight.DisplayValue : '-';
}
