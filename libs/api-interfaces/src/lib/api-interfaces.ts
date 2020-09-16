export interface Message {
  message: string;
}

export const generateUuid = function () {
  const buf: Uint32Array = new Uint32Array(4);
  window.crypto.getRandomValues(buf);
  let idx = -1;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    idx++;
    /* tslint:disable:no-bitwise */
    const r = (buf[idx >> 3] >> ((idx % 8) * 4)) & 15;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    /* tslint:enable:no-bitwise */
    return v.toString(16);
  });
};
