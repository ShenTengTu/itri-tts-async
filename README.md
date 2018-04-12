[![npm version](https://badge.fury.io/js/itri-tts-async.svg)](https://badge.fury.io/js/itri-tts-async)

# ITRI TTS async for Node.js
This tool let you use Node.js to operate [ITRI TTS Web service](http://tts.itri.org.tw/index.php).You muse register a account of the service before using this tool.

The service uses the UTF-8 format and Simple Object Access Protocol (SOAP), and provides a synthetic audio file for downloading.

When TTS converting success, you can browse the [Synthetic history](http://tts.itri.org.tw/online_tts/advance_n_download.php) in offcial site.
> 這個工具讓你使用Node.js來操作[工研院文字轉語音Web服務](http://tts.itri.org.tw/index.php)。在使用此工具之前，您需要註冊該服務的帳戶。
>
> 該服務使用UTF-8格式和簡單物件存取協定（SOAP），並提供用於下載的合成音頻文件。
>
> 當TTS轉換成功時，您可以在官方網站瀏覽[合成歷史記錄](http://tts.itri.org.tw/index.php)

## install
```
npm i itri-tts-async
```

## Reference
- [ITRI TTS Web service API](http://tts.itri.org.tw/development/web_service_api.php)

## Documentation
Check out [Documentation](https://shentengtu.github.io/itri-tts-async/)

## Description
All Method are `async` function.You can use `Promise.prototype.then()`, or use `await` in your `async` function.

Fist you must use your account to create a Promise to request SOAP Client then passing `TTSClient` object :
```js
require('dotenv').config()
const {ITRITTS} = require('itri-tts-async');

//Return Promise
let tts = ITRITTS.create(process.env.Account,process.env.Password)
tts.then((ttsClient)=>{
  console.log(ttsClient)
})

//OR return TTSClient object
async function main () {
  let ttsClient = await ITRITTS.create(process.env.Account,process.env.Password)
  console.log(ttsClient)
}
```

Now you can use `TTSClient` converting Text to Speech. If fulfilled, you will get `TTSResult` object :
```js
...
...
//Return Promise
tts.then((ttsClient)=>{
  return ttsClient.ConvertSimple("Hello,world.我是Bruce!這是一個Node.js測試。")
}).then((ttsResult) => {
  console.log(ttsResult)
})

//OR return TTSResult object
async function main () {
  ...
  ...
  let ttsResult = await ttsClient.ConvertSimple("Hello,world.我是Bruce!這是一個Node.js測試。")
  console.log(ttsResult)
}
```

If `TTSClient.resultCode` is 0 (Success), use `TTSClient.GetConvertStatus()` method to get `TTSStatus` object :
```js
...
...
//Return Promise
tts.then((ttsClient)=>{
  return ttsClient.ConvertSimple("Hello,world.我是Bruce!這是一個Node.js測試。")
}).then((ttsResult) => {
  return ttsResult.GetConvertStatus()
}).then((ttsStatus)=>{
  console.log(ttsStatus)
})

//OR return TTSStatus object
async function main () {
  ...
  ...
  let ttsStatus = ttsResult.GetConvertStatus()
  console.log(ttsStatus)
}
```
if `TTSStatus.statusCode` is 2 (completed), the speech file url will in `TTSStatus.result`.

This tool provides `TTSStatus.GetConvertStatus()` method helping you to track the status by yourself :
```js
...
...
//Return Promise
tts.then((ttsClient)=>{
  return ttsClient.ConvertSimple("Hello,world.我是Bruce!這是一個Node.js測試。")
}).then((ttsResult) => {
  return ttsResult.GetConvertStatus()
}).then((ttsStatus)=>{
  console.log(ttsStatus)
  return  ttsStatus.GetConvertStatus()
}).then((newStatus)=>{
  console.log(newStatus)
})

//OR return TTSStatus object
async function main () {
  ...
  ...
  let newStatus = ttsStatus.GetConvertStatus()
  console.log(newStatus)
}
```
