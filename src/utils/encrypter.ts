export function encodeBase64(data: any) {
  return Buffer.from(data, 'ascii').toString('base64');
}

export function decodeBase64(data: any) {
  return Buffer.from(data, 'base64').toString('ascii');
}
