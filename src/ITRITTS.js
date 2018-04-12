/**
* This tool let you use Node.js to operate ITRI TTS Web service.
* @module itri-tts-async
*/

const soap = require('soap');
const TTSService = 'http://tts.itri.org.tw/TTSService/Soap_1_3.php?wsdl';

/**
 * A class which only has a static method `create` to produce `TTSClient`
 * @class
 */
function ITRITTS(){}

/**
 * Main class to operate TTS Web service
 * @param {string} account - account of TTS Web service
 * @param {string} password - password of TTS Web service
 * @return {Promise<TTSClient>}
 */
ITRITTS.create = async function(account, password) {
  try {
    let ttsC = new TTSClient(account, password)
    ttsC.soapClient = await soap.createClientAsync(TTSService)
    return ttsC
  } catch (e) {
    return e
  }
}

/**
 * Main class to operate TTS Web service
 * @class
 * @constructor
 * @param {string} account - account of TTS Web service
 * @param {string} password - password of TTS Web service
 */
function TTSClient(account, password) {
  this.user = {
    accountID: account,
    password: password
  }
  this.soapClient = undefined
}

/**
* Convert text use default option.
* @async
* @param {string} text - text want to convert
* @return {Promise<TTSResult>}
*/
TTSClient.prototype.ConvertSimple = async function(text) {
  try {
    let args = Object.assign({}, this.user, {
      TTStext: text
    })

    return this.soapClient.ConvertSimpleAsync(args).then((result) => {
      let values = result[0].Result.$value.split('&')
      return new TTSResult(this, values)
    })
  } catch (e) {
    return e
  }
}

/**
* Convert text use normal option.
* @async
* @param {string} text - text want to convert
* @param {object} opt - normal option.
*
* @property {string}  opt.TTSSpeaker - @see {@link TTSSpeaker}
* @property {number}  opt.volume - The range is 0~100, the default value is 100.
* @property {number}  opt.speed - The range is -10~10, the default value is 0.
* @property {string}  opt.outType - Output format (wav, flv).
* @return {Promise<TTSResult>}
*/
TTSClient.prototype.ConvertText = async function(text,opt) {
  try {
    let {TTSSpeaker,volume,speed,outType} = opt
    let args = Object.assign({}, this.user, {
      TTStext: text,
      TTSSpeaker: TTSSpeaker || 'Bruce',
      volume: volume || 100,
      speed: speed || 0,
      outType: outType || 'wav'
    })

    return this.soapClient.ConvertTextAsync(args).then((result) => {
      let values = result[0].Result.$value.split('&')
      return new TTSResult(this, values)
    })
  } catch (e) {
    return e
  }
}

/**
* Convert text use advanced option.
* @async
* @param {string} text - text want to convert
* @param {object} opt - advanced option.
*
* @property {string}  opt.TTSSpeaker - @see {@link TTSSpeaker}
* @property {number}  opt.volume - The range is 0~100, the default value is 100.
* @property {number}  opt.speed - The range is -10~10, the default value is 0.
* @property {string}  opt.outType - Output format (wav, flv).
* @property {number}  opt.PitchLevel - Pitch, the range is -10~10, default value is 0.
* @property {number}  opt.PitchSign - 0=normal, 1=like robot, 2=speak Chinese like foreigners.
* @property {number}  opt.PitchScale - Intonation, the range is 0~20, default value is 5.
* @return {Promise<TTSResult>}
*/
TTSClient.prototype.ConvertAdvancedText = async function(text,opt) {
  try {
    let {TTSSpeaker,volume,speed,outType,PitchLevel,PitchSign,PitchScale} = opt
    let args = Object.assign({}, this.user, {
      TTStext: text,
      TTSSpeaker: TTSSpeaker || 'Bruce',
      volume: volume || 100,
      speed: speed || 0,
      outType: outType || 'wav',
      PitchLevel: PitchLevel || 0,
      PitchSign: PitchSign || 0,
      PitchScale: PitchScale || 5,
    })

    return this.soapClient.ConvertAdvancedTextAsync(args).then((result) => {
      let values = result[0].Result.$value.split('&')
      return new TTSResult(this, values)
    })
  } catch (e) {
    return e
  }
}

/**
* Get convert status based on given convert ID
* @async
* @return {Promise<TTSStatus>}
*/
TTSClient.prototype.GetConvertStatus = async function (id){
  try{
    let args = Object.assign({},this.user,{convertID:id})
    return this.soapClient.GetConvertStatusAsync(args).then((result) => {
      let values = result[0].Result.$value.split('&')
      return new TTSStatus(this,args.convertID,values)
    })
  }catch(e){
    return e
  }
}

/**
 * A class to represent TTS request result
 * @class
 * @constructor
 * @param {TTSClient} client - TTSClient
 * @param {string[]} values - TTS response values
 */
function TTSResult(client,values) {
  /**TTSClient*/
  this.client = client
  /**@see http://tts.itri.org.tw/development/web_service_api.php*/
  this.resultCode = values[0]
  /**@see http://tts.itri.org.tw/development/web_service_api.php*/
  this.resultString = values[1]
  /**A convert ID if Convert success.
   * @see http://tts.itri.org.tw/development/web_service_api.php*/
  this.result = values[2]
}

/**
* Get convert status based on self convert ID
* @async
* @return {Promise<TTSStatus>}
*/
TTSResult.prototype.GetConvertStatus = async function (){
  try{
    if(this.resultCode !== '0') return null

    return this.client.GetConvertStatus(this.result)
  }catch(e){
    return e
  }
}

/**
 * A class to represent TTS converting status
 * @class
 * @constructor
 * @param {TTSClient} client - TTSClient
 * @param {string} convertID - TTS convert ID
 * @param {string[]} values - TTS response values
 */
function TTSStatus(client,convertID,values) {
  /**TTSClient*/
  this.client = client
  /**TTS convert ID*/
  this.convertID = convertID
  /**@see http://tts.itri.org.tw/development/web_service_api.php*/
  this.resultCode = values[0]
  /**@see http://tts.itri.org.tw/development/web_service_api.php*/
  this.resultString = values[1]
  /**@see http://tts.itri.org.tw/development/web_service_api.php*/
  this.statusCode = values[2]
  /**@see http://tts.itri.org.tw/development/web_service_api.php*/
  this.status = values[3]
  /**A speech file link if Convert success.
   * @see http://tts.itri.org.tw/development/web_service_api.php*/
  this.result = values[4]
}

/**
* Get convert status based on self convert ID
* @async
* @return {Promise<TTSStatus>}
*/
TTSStatus.prototype.GetConvertStatus = async function (){
  try{
    return this.client.GetConvertStatus(this.convertID)
  }catch(e){
    return e
  }
}

/**
 * A class which only has static properties to represent each TTS speaker
 * @class
 */
function TTSSpeaker() {}
/** 中英切換男生語音(default)*/
TTSSpeaker.Bruce = 'Bruce';
/** 中英切換女生語音*/
TTSSpeaker.Theresa = 'Theresa';
/** 中英切換小女孩語音*/
TTSSpeaker.Angela = 'Angela';
/** 中英統合男生語音*/
TTSSpeaker.MCHEN_Bruce = 'MCHEN_Bruce';
/** 中英統合女生語音*/
TTSSpeaker.MCHEN_Joddess = 'MCHEN_Joddess';
/** 英文男生語音*/
TTSSpeaker.ENG_Bob = 'ENG_Bob';
/** 英文女生語音*/
TTSSpeaker.ENG_Alice = 'ENG_Alice';
/** 英文小男孩語音*/
TTSSpeaker.ENG_Tracy = 'ENG_Tracy';
/** 台語女生語音(文讀台)*/
TTSSpeaker.TW_LIT_AKoan = 'TW_LIT_AKoan';
/** 台語女生語音(白話台)*/
TTSSpeaker.TW_SPK_AKoan = 'TW_SPK_AKoan';

module.exports = {
  /** ITRITTS Class*/
  ITRITTS:ITRITTS,
  /** TTSSpeaker Class*/
  TTSSpeaker:TTSSpeaker
}
