import jwt from 'jsonwebtoken';
import crypto, { enc } from 'crypto-js';
import { AuthTokenPayload } from 'src/types/custom_interface';

const SESSION_SECRET = process.env.SESSION_SECRET;
const TOKEN_HASH = process.env.TOKEN_HASH;

if (!SESSION_SECRET) {
  throw new Error('No session secret defined in env file');
}

if (!TOKEN_HASH) {
  throw new Error('No token hash is provided');
}

const TOKEN_EXPIRED_MESSAGE = 'token expired';


export const createAuthToken = (payload: AuthTokenPayload): string => {
  const token = jwt.sign(payload, SESSION_SECRET, { expiresIn: payload.expires_in });
  return encodeURIComponent(crypto.AES.encrypt(token, TOKEN_HASH).toString());
};

export const validateAuthToken = (token: string): any => {
  try {
    const uriDecodedToken = decodeURIComponent(token)
    const decryptedTokenBytes = crypto.AES.decrypt(uriDecodedToken, TOKEN_HASH);
    const decryptedToken = decryptedTokenBytes.toString(enc.Utf8);
    const payload = jwt.verify(decryptedToken, SESSION_SECRET);

    return {
      payload: payload as AuthTokenPayload,
      expired: false,
    };
  } catch (error) {
    console.log(error);

    return {
      payload: null,
      expired: (error as Error).message.includes(TOKEN_EXPIRED_MESSAGE),
    };
  }
};
