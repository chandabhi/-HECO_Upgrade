import hideCancel from '../../../../SAPAssetManager/Rules/ErrorArchive/HideCancelForErrorArchiveFix';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import common from '../../Common/Library/CommonLibrary';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import libMeter from './MeterLibrary';

export default function HideCancelOnPageLoad(context) {

    //HECO If in meter, default to initial values
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if(meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        hideCancel(context);
        common.saveInitialValues(context);
        return;
    }

    let helper = new FDCSectionHelper(context);

    helper.run((sectionBinding, section) => {
        if (!sectionBinding) {
            sectionBinding = {};
        }

        const readPath = (function() {
            if (context.binding.DisconnectObject_Nav) {
                return `${context.binding.DisconnectObject_Nav['@odata.readLink']}/Device_Nav/MeterReadings_Nav`;
            } else {
                return `${context.binding['@odata.readLink']}/Device_Nav/MeterReadings_Nav`;
            }
        })();
        return context.read('/SAPAssetManager/Services/AssetManager.service', readPath, [], `$filter=sap.islocal() and Register eq '${sectionBinding.RegisterNum}'&orderby=MeterReadingDate`).then(function(result) {
            if (result.length > 0) {
                let localReading = result.getItem(0);
                sectionBinding.MeterReadingRecorded = localReading.MeterReadingRecorded;
                sectionBinding.UsagePeakTimeBool = (localReading.DateMaxRead !== null);
                sectionBinding.MeterReaderNote = localReading.MeterReaderNote;

                let dateTime = new ODataDate(localReading.MeterReadingDate, localReading.MeterReadingTime);
                let dateMaxRead = localReading.DateMaxRead ?
                        new ODataDate(localReading.DateMaxRead, localReading.TimeMaxReading) :
                        dateTime;

                sectionBinding.MeterReadingDate = dateTime.toLocalDateString();

                if (sectionBinding.UsagePeakTimeBool) {
                    sectionBinding.DateMaxRead = dateMaxRead.toLocalDateString();
                }

                let readingValueControlProxy = section.getControl('ReadingValue');
                let peakTimeSwitchControlProxy = section.getControl('PeakTimeSwitch');
                let peakTimeControlProxy = section.getControl('PeakUsageTimeControl');
                let readingTimeControlProxy = section.getControl('ReadingTimeControl');
                let notePickerControlProxy = section.getControl('NotePicker');
                let discardButton = section.getControl('DiscardButton');

                readingValueControlProxy.setValue(sectionBinding.MeterReadingRecorded);
                peakTimeSwitchControlProxy.setValue(sectionBinding.UsagePeakTimeBool);
                peakTimeControlProxy.setValue(new Date(dateMaxRead._date - (common.getBackendOffsetFromSystemProperty(context) * 1000 * 3600 + new Date().getTimezoneOffset() * 60 * 1000)));
                readingTimeControlProxy.setValue(new Date(dateTime._date - (common.getBackendOffsetFromSystemProperty(context) * 1000 * 3600 + new Date().getTimezoneOffset() * 60 * 1000)));
                notePickerControlProxy.setValue(sectionBinding.MeterReaderNote);

                peakTimeControlProxy.setVisible(sectionBinding.UsagePeakTimeBool);
                discardButton.setVisible(Boolean(sectionBinding['@odata.editLink']));

                // sectionBinding.DeviceMeterReadingReadLink = localReading['@odata.readLink'];
                sectionBinding.MeterReadingReadLink = localReading['@odata.readLink'];
            }
        }).catch(() => Promise.resolve());
    });

    hideCancel(context);
    common.saveInitialValues(context);
}
