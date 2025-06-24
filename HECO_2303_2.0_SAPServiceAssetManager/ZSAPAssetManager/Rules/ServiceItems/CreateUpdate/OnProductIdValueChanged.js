import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OnProductIdValueChanged(control) {
    let pageProxy = control.getPageProxy();
    let value = CommonLibrary.getControlValue(control);
    let uomControl = CommonLibrary.getControlProxy(pageProxy, 'UomSimple');
    let timeUnitControl = CommonLibrary.getControlProxy(pageProxy, 'TimeUnitLstPkr');
    let itemCategoryControl = CommonLibrary.getControlProxy(pageProxy, 'ItemCategoryLstPkr');
    itemCategoryControl.setValue('');

    if (value) {
        control.read('/SAPAssetManager/Services/AssetManager.service', `Materials('${value}')`, [], '$select=BaseUOM').then(result => {
            let baseUom = result.length ? result.getItem(0).BaseUOM : ''; 
            uomControl.setValue(baseUom);
            timeUnitControl.setValue(baseUom);

            //reseting the control to reset picker values
            itemCategoryControl.reset().then(() => {
                itemCategoryControl.setEditable(true);  
            });
        });
    } else {
        timeUnitControl.setValue('');
        uomControl.setValue('');
        itemCategoryControl.setEditable(false);
    }
}
