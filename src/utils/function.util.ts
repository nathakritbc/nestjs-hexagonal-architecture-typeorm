import { customAlphabet } from 'nanoid';
import { numbers } from 'nanoid-dictionary';

export type OmitFunctions<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
export type PartialWithRequired<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;

export const generateRefId = <T extends string>(length: number = 4): T => {
  const getRefId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  return getRefId(length) as T;
};

export const generateOtpCode = <T extends string>(length: number = 6): T => {
  const getOtpCode = customAlphabet(numbers);
  return getOtpCode(length) as T;
};
