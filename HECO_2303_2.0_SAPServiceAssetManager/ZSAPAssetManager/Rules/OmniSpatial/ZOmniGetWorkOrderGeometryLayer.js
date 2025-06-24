export default function ZOmniGetWorkOrderGeometryLayer(context) {
  var workOrders = [];

  return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderGeometries', [], '$expand=WOHeader_Nav').then(function (result) {
    if (result && result.length > 0) {
      let orderGeometry = result;
      return context.read('/SAPAssetManager/Services/AssetManager.service', 'Geometries', [], "$filter=ObjectType eq 'ORH'").then(function (geoResults) {
        if (geoResults && geoResults.length > 0) {
          orderGeometry.forEach(item => {
            // if (item.WOGeometries.length > 0)
            // {
            var geoVal = '';
            geoResults.forEach(result => {
              var resultKey = result.ObjectKey.replace(/^0+/, '');
              if (resultKey == item.OrderId) {
                let parsed = JSON.parse(result.GeometryValue);
                geoVal = {
                  x: parsed.x,
                  y: parsed.y,
                  type: "point",
                  spatialReference: parsed.spatialReference
                };
              }
            });
            if (geoVal != '') {
              let order = {
                attributes: {
                  OrderId: item.OrderId,
                  OrderNum: item.OrderId,
                  OrderDescription: item.WOHeader_Nav.OrderDescription,
                  OrderType: item.WOHeader_Nav.OrderType,
                  Priority: item.WOHeader_Nav.Priority
                },
                geometry: geoVal,
              };

              workOrders.push(order);
            }
            // }
          });


          let assetData =
          {
            source: "SAM",
            eventName: "add-layer",
            data:
            {
              zoomToExtent: false,
              replaceExisting: true,
              layer: {
                id: "my-orders",
                title: "My Work Orders",
                type: "feature",
                geometryType: "point",
                objectIdField: "OrderId",
                editingEnabled: false,
                visible: true,
                renderer: {
                  type: "simple",
                  symbol: {
                    type: "simple-marker",
                    style: "square",
                    size: "25px",
                    color: "blue",
                    outline: {
                      width: 0.5,
                      color: "white"
                    }
                  },
                },
                fields: [
                  {
                    name: "OrderId",
                    type: "string",
                    alias: "Order ID",
                    editable: false,
                    length: 12
                  },
                  {
                    name: "OrderNum",
                    type: "string",
                    alias: "Order",
                    editable: false,
                    length: 40,
                  },
                  {
                    name: "OrderDescription",
                    type: "string",
                    alias: "Description",
                    editable: false,
                    length: 40,
                  },
                  {
                    name: "OrderType",
                    type: "string",
                    alias: "Type",
                    editable: false,
                    length: 50,
                  },
                  {
                    name: "Priority",
                    type: "string",
                    alias: "Priority",
                    editable: false,
                    length: 1,
                  }
                ],
                source: workOrders
              },
              actions: [
                {
                  title: "View Work Order",
                  type: "native-script-event",
                  eventName: "ViewWorkOrder"
                }
              ]
            }
          };

          return assetData;
        }
      });
    }
    return false;
  });

  // let samplelayer = ("add-layer",
  // {
  //   "source": "SAM",
  //   "eventName": "add-layer",
  //   "data": {
  //     "zoomToExtent": true,
  //     "replaceExisting": true,
  //     "layer":
  //     {
  //       "id": "my-orders",
  //       "title": "My Work Orders",
  //       "geometryType": "point",
  //       "objectIdField": "OrderId",
  //       "editingEnabled": false,
  //       "visible": true,
  //       "renderer": {
  //         "type": "unique-value",
  //         "field": "Priority",
  //         "defaultSymbol": { "type": "simple-marker", "style": "square", "size": "25px", "color": "blue" },
  //         "visualVariables": [{ "type": "size", "field": "Priority", "minDataValue": 1, "maxDataValue": 3, "minSize": 24, "maxSize": 14 }],
  //         "uniqueValueInfos": [{ "value": "1", "symbol": { "type": "simple-marker", "style": "square", "size": "25px", "color": "red" } }, { "value": "2", "symbol": { "type": "simple-marker", "style": "square", "size": "25px", "color": "yellow" } }, { "value": "3", "symbol": { "type": "simple-marker", "style": "square", "size": "25px", "color": "blue" } }]
  //       },
  //       "fields": [
  //         { "name": "OrderId", "type": "string", "alias": "Order ID", "editable": false, "length": 12 },
  //         { "name": "OrderNum", "type": "string", "alias": "Order", "editable": false, "length": 40 },
  //         { "name": "OrderDescription", "type": "string", "alias": "Description", "editable": false, "length": 40 },
  //         { "name": "OrderType", "type": "string", "alias": "Type", "editable": false, "length": 50 },
  //         { "name": "Priority", "type": "string", "alias": "Priority", "editable": false, "length": 1 },
  //         { "name": "MobileStatus", "type": "string", "alias": "Status", "editable": false, "length": 10 }
  //       ],
  //       "source": [{ "attributes": { "OrderId": "4000734", "OrderNum": "4000734", "OrderDescription": "Verify Valve Accuation", "OrderType": "M01", "Priority": "3", "MobileStatus": "RECEIVED" }, "geometry": { "x": -11344589.7755, "y": 3964036.7716, "type": "point", "spatialReference": { "wkid": 102100, "latestWkid": 3857 } } }, { "attributes": { "OrderId": "4000744", "OrderNum": "4000744", "OrderDescription": "Valve Accuation Manual Check", "OrderType": "M01", "Priority": "3", "MobileStatus": "RECEIVED" }, "geometry": { "x": -11344589.7755, "y": 3964036.7716, "type": "point", "spatialReference": { "wkid": 102100, "latestWkid": 3857 } } }, { "attributes": { "OrderId": "4000753", "OrderNum": "4000753", "OrderDescription": "Valve Accuation Manual Check", "OrderType": "M01", "Priority": "3", "MobileStatus": "RECEIVED" }, "geometry": { "x": -11344589.7755, "y": 3964036.7716, "type": "point", "spatialReference": { "wkid": 102100, "latestWkid": 3857 } } }, { "attributes": { "OrderId": "4000745", "OrderNum": "4000745", "OrderDescription": "Valve Accuation Manual Check", "OrderType": "M01", "Priority": "2", "MobileStatus": "RECEIVED" }, "geometry": { "x": -11344589.7755, "y": 3964036.7716, "type": "point", "spatialReference": { "wkid": 102100, "latestWkid": 3857 } } }]
  //     },
  //     "actions": [{ "title": "View Work Order", "type": "native-script-event", "eventName": "ViewWorkOrder" }]
  //   }
  // }
  // );
}