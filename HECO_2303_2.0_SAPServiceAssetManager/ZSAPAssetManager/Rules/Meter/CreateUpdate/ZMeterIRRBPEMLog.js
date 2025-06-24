export default function ZMeterIRRBPEMLog(context) {
    //Updates device log with readings taken from meter(s)

    let meterReadings = '';
    let equipment;
    let orderId;

    if (context.binding['@odata.type'] == '#sap_mobile.OrderISULink') {
        orderId = context.binding.Workorder_Nav.OrderId; //From meter page
    } else {
        orderId = context.binding.OrderId; //From order page
    }

    context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderISULinks', [], `$filter=OrderNum eq '${orderId}'`).then(isuLinks => {
        if (isuLinks.length > 0) {
            let readingPromises = [];
            for(let i = 0; i<isuLinks.length;i++) {
                let isuLink = isuLinks.getItem(i);
                if( isuLink.ISUProcess != 'REP_INST' && isuLink.EquipmentNum != '') { 
                    //BPEM data goes on the install portion of the meter replace which is 'REP_INSTALL'.
                    equipment = isuLink.EquipmentNum;
                }


                
                readingPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=sap.islocal() and EquipmentNum eq '${isuLink.EquipmentNum}'&$orderby=RegisterGroup,Register`).then(readings => {
                    if (readings.length > 0) {
                        if(meterReadings.length > 0) { // Add padding between meters
                            meterReadings += ' ';
                        }
                        for (let i = 0; i < readings.length; i++) {
                            let reading = readings.getItem(i);
                            if( i > 0) {
                                meterReadings +=  ' | ';
                            }
                            meterReadings += 'EquipmentNum: ' + reading.EquipmentNum +
                                ' Register: ' + reading.Register +
                                ' MeterReadingRecorded: ' + reading.MeterReadingRecorded +
                                ' MeterReaderNote: ' + reading.MeterReaderNote;
                        }
                    }
                }),
                );
                
            }

            Promise.all(readingPromises).then(() => {
                    let deviceBPEMProperties = {
                        'ZMeterIRRSummarizedReadingsText': meterReadings
                    };
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/Meters/CreateUpdate/ZMeterIRRBPEM.action',
                        'Properties': {
                            'Properties': deviceBPEMProperties,
                            'Target':
                            {
                                "EntitySet": "Devices",
                                "Service": "/SAPAssetManager/Services/AssetManager.service",
                                "QueryOptions": `$filter=Device eq '${equipment}'`
                            },
                            'Headers':
                            {
                                'OfflineOData.TransactionID': equipment
                            },
                        },
                    });
                });
        }
    });

}
