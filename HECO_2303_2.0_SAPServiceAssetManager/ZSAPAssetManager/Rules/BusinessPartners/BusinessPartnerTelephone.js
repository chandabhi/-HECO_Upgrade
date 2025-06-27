import {BusinessPartnerWrapper} from './../../../SAPAssetManager/Rules/BusinessPartners/BusinessPartnerWrapper';
import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libEval from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import contextConverter from '../../../SAPAssetManager/Rules/Meter/BusinessPartners/BusinessPartnerContextConverter';
import userFeaturesLib from '../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';

export default function BusinessPartnerTelephone(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        contextConverter(context);
    }
    let pageName = libCom.getPageName(context);
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let telephoneLong = wrapper.communicationProperty('Telephone');
    let telephoneShort = wrapper.communicationProperty('TelephoneShort');
    let extension = wrapper.communicationProperty('Extension');
    let telephone = '';

    let isOnEditPage = pageName === 'BusinessPartnerEditPage';
    if (isOnEditPage) {
        telephone = telephoneShort;
    } else {
        telephone = telephoneLong;
    }

    if (!libEval.evalIsEmpty(extension) && !isOnEditPage) {
        let ext_idx = telephoneLong.length - extension.length;
        if (ext_idx > 0) {
            telephone = telephoneLong.substring(0, ext_idx);
        }
    }
    
    let emptyVal = isOnEditPage ? '' : '-';
    let PageName= libCom.getPageName(context);

    // Return blank value to disable phone icon when telephone number is blank
    if(PageName==="WorkOrderDetailsPage"&&!telephone){
        emptyVal = '';
    }
    if (libEval.evalIsEmpty(telephoneLong)) return emptyVal;

    if (!isOnEditPage && !libEval.evalIsEmpty(extension)) {
        telephone = context.localizeText('telephone_w_ext', [telephone, extension]);
    }
    return telephone;       
}
