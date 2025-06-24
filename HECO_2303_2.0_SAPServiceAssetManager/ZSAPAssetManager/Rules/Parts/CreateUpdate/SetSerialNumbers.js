import SetMaterialUoM from './SetMaterialUoM';
import Logger from '../../Log/Logger';
import SetBatch from '../../Inventory/IssueOrReceipt/SetBatch';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetSerialNumbers(clientAPI) {
    libCom.setStateVariable(clientAPI, 'SerialNumbers', {actual: null, initial: null});
    let serialNumButton = clientAPI.getPageProxy().evaluateTargetPathForAPI('#Control:SerialPageNav');
    let quantityControl = libCom.getControlProxy(clientAPI.getPageProxy(), 'QuantitySimple');
    let materialNumControl = libCom.getControlProxy(clientAPI.getPageProxy(), 'MaterialNumber');
    let isOnlineSearchEnabled = libCom.getControlProxy(clientAPI.getPageProxy(), 'OnlineSwitch').getValue();

    if (clientAPI.getValue().length) {
        let materialPickerValue = clientAPI.getValue()[0].ReturnValue;
        libCom.setStateVariable(clientAPI, 'MaterialReadLink',materialPickerValue);
        let entity = materialPickerValue;
        let service = '/SAPAssetManager/Services/AssetManager.service';
        let query = '$expand=MaterialPlant'; 
        clientAPI.read(service, entity, [], query).then(result => {
            if (result.getItem(0).MaterialPlant.SerialNumberProfile) {
                serialNumButton.setVisible(true);
                quantityControl.setEditable(false);
            } else {
                serialNumButton.setVisible(false);
                quantityControl.setEditable(true);
            }
        }).catch(err => {
            Logger.error(`Failed to read Online MyEquipSerialNumbers: ${err}`);
            serialNumButton.setVisible(false);
            quantityControl.setEditable(true);
        });    

        if (isOnlineSearchEnabled && materialPickerValue.includes("MaterialNum='")) {
            let materialNum = materialPickerValue.split("MaterialNum='")[1].split("'")[0];
            materialNumControl.setValue(materialNum);
        }

        SetMaterialUoM(clientAPI);
    } else {
        libCom.setStateVariable(clientAPI, 'MaterialReadLink','');
        serialNumButton.setVisible(false);
        quantityControl.setEditable(true);
    }
    SetBatch(clientAPI);
}
