export type IettService = 
  | 'HatDurakGuzergah'
  | 'PlanlananSeferSaati'
  | 'Duyurular'
  | 'SeferGerceklesme'
  | 'AracOzellik'
  | 'ibb'
  | 'ibb360';

const serviceMap: Record<IettService, string> = {
  HatDurakGuzergah: '/UlasimAnaVeri/HatDurakGuzergah',
  PlanlananSeferSaati: '/UlasimAnaVeri/PlanlananSeferSaati',
  Duyurular: '/UlasimDinamikVeri/Duyurular',
  SeferGerceklesme: '/FiloDurum/SeferGerceklesme',
  AracOzellik: '/AracAnaVeri/AracOzellik',
  ibb: '/ibb/ibb',
  ibb360: '/ibb/ibb360'
};

export class IettApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IettApiError';
  }
}

interface IettAuthHeader {
  Username: string;
  Password: string;
}

/**
 * Creates a SOAP envelope for IETT API requests
 */
function createSoapEnvelope(
  method: string,
  params: Record<string, unknown>,
  authHeader: IettAuthHeader
): string {
  const paramXml = Object.entries(params)
    .map(([key, value]) => `<${key}>${value}</${key}>`)
    .join('');

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <AuthHeader xmlns="http://tempuri.org/">
      <Username>${authHeader.Username}</Username>
      <Password>${authHeader.Password}</Password>
    </AuthHeader>
  </soap:Header>
  <soap:Body>
    <${method} xmlns="http://tempuri.org/">
      ${paramXml}
    </${method}>
  </soap:Body>
</soap:Envelope>`;
}

/**
 * Makes a request to the IETT SOAP API
 * @param service - The IETT service to call
 * @param method - The method name to call on the service
 * @param params - Optional parameters to pass to the method
 * @returns Promise with the parsed response data
 */
export async function iettAPI<T = unknown>(
  service: IettService,
  method: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const url = `https://api.ibb.gov.tr/iett${serviceMap[service]}.asmx`;
  const requestMethodType = service === 'ibb' ? method : `${method}_json`;
  const responseMethodType = service === 'ibb' ? `${method}Result` : `${method}_jsonResult`;

  // Get auth credentials from environment variables
  const authHeader: IettAuthHeader = {
    Username: process.env.IETT_API_USERNAME || '',
    Password: process.env.IETT_API_PASSWORD || ''
  };

  try {
    const soapEnvelope = createSoapEnvelope(requestMethodType, params, authHeader);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': `http://tempuri.org/${requestMethodType}`
      },
      body: soapEnvelope,
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Extract the result from XML response
    const resultMatch = xmlText.match(new RegExp(`<${responseMethodType}>(.*?)</${responseMethodType}>`, 's'));
    if (!resultMatch) {
      throw new Error('Could not find result in SOAP response');
    }

    const resultText = resultMatch[1];
    let data: T;

    try {
      // Try parsing as JSON first
      data = JSON.parse(resultText) as T;
    } catch {
      // If not JSON, return as is
      data = resultText as T;
    }

    return data;
  } catch (error) {
    throw new IettApiError(
      error instanceof Error ? error.message : 'Unknown IETT API error'
    );
  }
} 