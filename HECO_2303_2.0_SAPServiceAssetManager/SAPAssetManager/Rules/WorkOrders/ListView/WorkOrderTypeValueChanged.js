import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function WorkOrderTypeValueChanged(context) {
    let values = context.getValue();
    let phaseFilterControl = context.getPageProxy().getControl('FormCellContainer').getControl('PhaseFilter');
    let phaseControlFilterControl = context.getPageProxy().getControl('FormCellContainer').getControl('PhaseControlFilter');

    if (IsPhaseModelEnabled(context) && values && values.length) {
        let orderTypes = [];
        values.forEach(value => {
            orderTypes.push(`OrderType eq '${value.ReturnValue}'`);
        });

        let queryOptions = '$filter=(' + orderTypes.join(' or ') + ') and PhaseModelActive eq \'X\'';
        context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], queryOptions)
            .then(result => {
                phaseFilterControl.setVisible(result && !!result.length);
                phaseFilterControl.setValue('');
                phaseControlFilterControl.setVisible(result && !!result.length);
                phaseControlFilterControl.setValue('');
            }).catch(() => {
                phaseFilterControl.setVisible(false);
                phaseFilterControl.setValue('');
                phaseControlFilterControl.setVisible(false);
                phaseControlFilterControl.setValue('');
            });
    }

    phaseFilterControl.setVisible(false);
    phaseFilterControl.setValue('');
}
