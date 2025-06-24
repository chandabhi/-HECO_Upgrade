export default function ZOmniPostMessageToWebView(webViewExt, data)
{
  //Omni won't pick up the normal interface emit, but does receive postMessage
  let scriptCode = `
            window.postMessage(${JSON.stringify(data)});
        `;
  return webViewExt.executeJavaScript(scriptCode);


}