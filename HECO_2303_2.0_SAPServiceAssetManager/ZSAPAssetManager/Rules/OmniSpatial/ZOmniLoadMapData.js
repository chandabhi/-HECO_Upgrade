import ZOmniGetInterface from './ZOmniGetInterface';
import ZOmniGetFuncLocEvents from './ZOmniGetFuncLocEvents';
import ZOmniGetWorkOrderGeometryLayer from './ZOmniGetWorkOrderGeometryLayer';
import ZOmniPostMessageToWebView from './ZOmniPostMessageToWebView';

export default function ZOmniLoadMapData(context)
{
  let webViewExt = ZOmniGetInterface(context);

  if (webViewExt.src)
  {
    ZOmniGetWorkOrderGeometryLayer(context).then(function (orderLayer)
    {
      ZOmniPostMessageToWebView(webViewExt, orderLayer)
        .then((result) => ZOmniPostMessageToWebView(webViewExt, ZOmniGetFuncLocEvents(context)))
    });
  }
}