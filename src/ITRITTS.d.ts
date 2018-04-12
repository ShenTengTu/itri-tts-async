import { Client } from 'soap';

export declare class ITRITTS {
  static create(account: string, password: string): Promise<TTSClient>
}

export declare class TTSSpeaker {
  static Bruce: string
  static Theresa: string
  static Angel: string
  static MCHEN_Bruce: string
  static MCHEN_Joddess: string
  static ENG_Bob: string
  static ENG_Alice: string
  static ENG_Tracy: string
  static TW_LIT_AKoan: string
  static TW_SPK_AKoan: string
}

declare class TTSClient {
  users: { accountID: string, password: string }
  soapClient: undefined | Client

  constructor(account:string, password:string)

  ConvertSimple(text: string): Promise<TTSClient>

  ConvertText(text: string, opt: {
    TTSSpeaker: string,
    volume: number,
    speed: number,
    outType: string
  }): Promise<TTSClient>

  ConvertAdvancedText(text: string, opt: {
    TTSSpeaker: string,
    volume: number,
    speed: number,
    outType: string,
    PitchLevel: number,
    PitchSign: number,
    PitchScale: number
  }): Promise<TTSClient>

  GetConvertStatus(id: string): Promise<TTSStatus>
}

declare class TTSResult {
  client: TTSClient
  resultCode: string
  resultString: string
  result: undefined | string

  constructor(client:TTSClient,values:string[])

  GetConvertStatus(): Promise<TTSStatus>
}

declare class TTSStatus {
  client: TTSClient
  convertID: string
  resultCode: string
  resultString: string
  statusCode: string
  status: string
  result: string

  constructor(client:TTSClient,convertID:string,values:string[])

  GetConvertStatus(): Promise<TTSStatus>
}
