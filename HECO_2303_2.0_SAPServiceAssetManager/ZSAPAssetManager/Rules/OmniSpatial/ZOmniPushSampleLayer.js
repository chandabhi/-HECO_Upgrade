
export default function ZOmniPushSampleLayer(context)
{

  let sampleLayer = ("add-layer",
  {
    "source": "SAM",
    "eventName": "add-layer",
    "data": {
      "zoomToExtent": true,
      "replaceExisting": true,
      "layer":
      {
        "type": "feature",
        "id": "my-breadcrumbs",
        "editingEnabled": false,
        "title": "My Location History",
        "visible": true,
        "geometryType": "point",
        "objectIdField": "TimeStamp",
        "renderer": {
          "type": "simple",
          "symbol": {
            "type": "simple-marker",
            "size": 6,
            "color": "red",
            "outline": {
              "width": 0.5,
              "color": "white"
            }
          }
        },
        "fields": [
          {
            "name": "TimeStamp",
            "type": "string",
            "editable": false,
            "alias": "Time Stamp",
            "length": 10
          },
          {
            "name": "FormattedTime",
            "type": "string",
            "alias": "Time",
            "editable": false,
            "length": 40
          }
        ],
        "source":
          [
            {
              "attributes": {
                "TimeStamp": "20220106144650",
                "MarkerType": "1",
                "FormattedTime": "1/6/2022 2:48:50"
              },
              "geometry": {
                "type": "point",
                "x": -158.033123,
                "y": 21.489961,
                "spatialReference": { "wkid": 4326 }
              }
            },
            {
              "attributes": {
                "TimeStamp": "20220106144850",
                "FormattedTime": "1/6/2022 2:50:50"
              },
              "geometry": {
                "type": "point",
                "x": -158.027372,
                "y": 21.484066,
                "spatialReference": { "wkid": 4326 }
              }
            },
            { "attributes": { "TimeStamp": "20220106145050", "FormattedTime": "1/6/2022 2:50:50" }, "geometry": { "type": "point", "x": -158.0261, "y": 21.477416, "spatialReference": { "wkid": 4326 } } },
            { "attributes": { "TimeStamp": "20220106145250", "FormattedTime": "1/6/2022 2:52:50" }, "geometry": { "type": "point", "x": -158.02454, "y": 21.468746, "spatialReference": { "wkid": 4326 } } },
            { "attributes": { "TimeStamp": "20220106145450", "FormattedTime": "1/6/2022 2:54:50" }, "geometry": { "type": "point", "x": -158.023418, "y": 21.462155, "spatialReference": { "wkid": 4326 } } }
          ]
      },
      "actions": [{}]
    }
  });

  // if (!webViewInterface)
  // {
  //   webViewInterface = ZWebViewGetInterface(context);
  // }
  // webViewInterface.emit('add-layer', locData);

  // let sampleData = '{"source":"SAM","eventName":"add-layer","data":{"zoomToExtent":true,"replaceExisting":true,"layer":{"type":"feature","id":"my-breadcrumbs","editingEnabled":false,"title":"My Location History","visible":true,"geometryType":"point","objectIdField":"TimeStamp","renderer":{"type":"simple","symbol":{"type":"simple-marker","size":6,"color":"red","outline":{"width":0.5,"color":"white"}}},"fields":[{"name":"TimeStamp","type":"string","editable":false,"alias":"Time Stamp","length":10},{"name":"FormattedTime","type":"string","alias":"Time","editable":false,"length":40}],"source":[{"attributes":{"TimeStamp":"20220106144650","MarkerType":"1","FormattedTime":"1/6/2022 2:48:50"},"geometry":{"type":"point","x":-158.033123,"y":21.489961,"spatialReference":{"wkid":4326}}},{"attributes":{"TimeStamp":"20220106144850","FormattedTime":"1/6/2022 2:50:50"},"geometry":{"type":"point","x":-158.027372,"y":21.484066,"spatialReference":{"wkid":4326}}},{"attributes":{"TimeStamp":"20220106145050","FormattedTime":"1/6/2022 2:50:50"},"geometry":{"type":"point","x":-158.0261,"y":21.477416,"spatialReference":{"wkid":4326}}},{"attributes":{"TimeStamp":"20220106145250","FormattedTime":"1/6/2022 2:52:50"},"geometry":{"type":"point","x":-158.02454,"y":21.468746,"spatialReference":{"wkid":4326}}},{"attributes":{"TimeStamp":"20220106145450","FormattedTime":"1/6/2022 2:54:50"},"geometry":{"type":"point","x":-158.023418,"y":21.462155,"spatialReference":{"wkid":4326}}}]},"actions":[{}]}}';
  // let parsedSample = JSON.parse(sampleData);
  // // webViewInterface.emit('add-layer', parsedSample);
  return sampleLayer;

}