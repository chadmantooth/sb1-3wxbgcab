import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXMLAsync = promisify(parseString);

export async function parseXML(xml: string): Promise<any> {
  try {
    return await parseXMLAsync(xml, {
      trim: true,
      explicitArray: false,
      mergeAttrs: true,
      normalize: true,
      explicitRoot: true,
      attrkey: 'attributes'
    });
  } catch (error) {
    throw new Error(`Failed to parse XML: ${error.message}`);
  }
}