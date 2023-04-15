package encryption

import (
	"syscall/js"
)

func GenerateKeysWrapper() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 0 {
			return "Correct Usage: generateKeyPairWASM()"
		}
		privateKey, publicKey := GenerateKeyPair(4096)
		privateKeyB64 := PrivateKeyToBase64(privateKey)
		publicKeyB64 := PublicKeyToBase64(publicKey)
		bothKeys := privateKeyB64 + "***" + publicKeyB64
		return bothKeys
	})
}

func EncryptWrapper() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 2 {
			return "Correct Usage: encryptWASM(textB64, publicKeyB64)"
		}
		textB64 := args[0].String()
		publicKeyB64 := args[1].String()

		publicKey := Base64ToPublicKey(publicKeyB64)
		textBytes := Base64ToBytes(textB64)
		encryptedBytes := EncryptWithPublicKey(textBytes, publicKey)
		encryptedMessage := string(encryptedBytes)
		return encryptedMessage
	})
}

func DecryptWrapper() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 2 {
			return "Correct Usage: decryptWASM(textB64, privateKeyB64)"
		}
		encryptedB64 := args[0].String()
		privateKeyB64 := args[1].String()

		privateKey := Base64ToPrivateKey(privateKeyB64)
		encryptedBytes := Base64ToBytes(encryptedB64)
		decryptedBytes := DecryptWithPrivateKey(encryptedBytes, privateKey)
		decryptedMessage := string(decryptedBytes)
		return decryptedMessage
	})
}
