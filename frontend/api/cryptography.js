import {encode, decode} from 'base64-arraybuffer'

export const createAESKey = async () => {
    const key = await window.crypto.subtle.generateKey(
        {
        name: 'AES-GCM',
        length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    );
    return key;
}

export const createRSAKeypair = async () => {
    const key = await window.crypto.subtle.generateKey(
        {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-512',
        },
        true,
        ['encrypt', 'decrypt'],
    );
    return key;
}

export const exportKey = async (key) => {
    const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
    return exportedKey;
}

export const importRSAPublicKey = async (key) => {
    const importedKey = await window.crypto.subtle.importKey('jwk', key, {name: 'RSA-OAEP', hash:"SHA-512"}, true, ['encrypt']);
    return importedKey;
}

export const importRSAPrivateKey = async (key) => {
    const importedKey = await window.crypto.subtle.importKey('jwk', key, {name: 'RSA-OAEP', hash:"SHA-512"}, true, ['decrypt']);
    return importedKey;
}

export const importAESKey = async (key) => {
    const importedKey = await window.crypto.subtle.importKey('jwk', key, 'AES-GCM', true, ['encrypt', 'decrypt']);
    return importedKey;
}

export const encryptRSA = async (key, data) => {
    let encoded = getMessageEncoding(data);
    const encrypted = await window.crypto.subtle.encrypt(
        {
        name: 'RSA-OAEP',
        },
        key,
        encoded,
    );
    let b64Message = encode(encrypted)
    return b64Message;
}

export const decryptRSA = async (key, total) => {
    let data = decode(total);

    const decrypted = await window.crypto.subtle.decrypt(
        {
        name: 'RSA-OAEP',
        },
        key,
        data,
    );

    const decryptedMessage = getMessageDecoding(decrypted)
    return decryptedMessage;
}

export const encryptAESKeyJWK = async (key, aesKey) => {
    let b64aesKey = keyToBase64(aesKey);
    let encryptedAESKey = await encryptRSA(key, b64aesKey);
    return encryptedAESKey
}

export const encryptAESKey = async (key, aesKey) => {
    let exportedAESKey = await exportKey(aesKey);
    let b64aesKey = keyToBase64(exportedAESKey);
    let encryptedAESKey = await encryptRSA(key, b64aesKey);
    return encryptedAESKey
}

export const decryptAESKey = async (key, encryptedAESKey) => {
    let decryptedAESKey = await decryptRSA(key, encryptedAESKey);
    let aesKeyJWK = base64ToKey(decryptedAESKey);
    let aesKey = await importAESKey(aesKeyJWK);
    return aesKey
}

export const decryptAESKeyJWK = async (key, encryptedAESKey) => {
    let decryptedAESKey = await decryptRSA(key, encryptedAESKey);
    let aesKeyJWK = base64ToKey(decryptedAESKey);
    return aesKeyJWK
}

export const encryptAES = async (key, message) => {
    let encoded = getMessageEncoding(message);
    let iv = window.crypto.getRandomValues(new Uint8Array(12));

    let ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encoded
    );

    let b64Message = encode(ciphertext)
    let b64iv = encode(iv)
    let b64total = b64Message + "***" + b64iv;
    return b64total
}
  
export const decryptAES = async (key, total) => {
    let split = total.split("***");
    let b64Message = split[0];
    let b64iv = split[1];

    let data = decode(b64Message);
    let iv = decode(b64iv);

    const decrypted = await window.crypto.subtle.decrypt(
        {
        name: 'AES-GCM',
        iv,
        },
        key,
        data,
    );

    const decryptedMessage = getMessageDecoding(decrypted)
    return decryptedMessage;
}

export const hashSHA512 = async (data) => {
    const hashed = await window.crypto.subtle.digest('SHA-512', data);
    return hashed;
}

export const keyToBase64 = (key) => {
    const keyString = JSON.stringify(key);
    const keyBase64 = btoa(keyString);
    return keyBase64;
}

export const base64ToKey = (key) => {
    const keyString = atob(key);
    const keyObject = JSON.parse(keyString);
    return keyObject;
}

export const jwkToBase64 = (key) => {
    const keyString = JSON.stringify(key);
    const keyBase64 = btoa(keyString);
    return keyBase64;
}

export const base64ToJwk = (key) => {
    const keyString = atob(key);
    const keyObject = JSON.parse(keyString);
    return keyObject;
}

const getMessageEncoding = (message) => {
    let enc = new TextEncoder();
    return enc.encode(message);
}

const getMessageDecoding = (message) => {
    let dec = new TextDecoder();
    return dec.decode(message);
}



