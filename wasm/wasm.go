package main

import (
	"syscall/js"

	"github.com/yzaimoglu/go-wasm/encryption"
)

func main() {
	js.Global().Set("generateKeyPairWASM", encryption.GenerateKeysWrapper())
	js.Global().Set("encryptWASM", encryption.EncryptWrapper())
	js.Global().Set("decryptWASM", encryption.DecryptWrapper())
	<-make(chan bool)
}
