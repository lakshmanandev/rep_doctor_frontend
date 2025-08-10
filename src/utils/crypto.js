import CryptoJS from "crypto-js";
import config from "../lib/config";

export const encryptObject = (encryptValue) => {
	try {
		let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(encryptValue), config.CRYPTO_SECRET_KEY).toString();
		return ciphertext;
	} catch (err) {
		return "";
	}
};

export const decryptObject = (decryptValue) => {
	try {
		let bytes = CryptoJS.AES.decrypt(decryptValue, config.CRYPTO_SECRET_KEY);
		let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		return decryptedData;
	} catch (err) {
		return "";
	}
};