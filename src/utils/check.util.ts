export function checkSuccessStatus(status: number) {
  return /[2][0-9][0-9]/.test(status.toString());
}

export function isIPV4(text: string) {
  return /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(text);
}
