<template>
    <div>
        <input type="text" v-model="plainMessage">
        <button @click="encryptMessage">Encrypt</button>
        <button @click="decryptMessage">Decrypt</button>
        <button @click="generateKeys">GenerateKeys</button>
        <p>{{ encryptedMessage }}</p>
        <p>{{ decryptedMessage }}</p>
    </div>
</template>

<script setup>
    const plainMessage = ref('Test')
    const encryptedMessage = ref('')
    const decryptedMessage = ref('')
    const privateKey = ref('')
    const publicKey = ref('')

    useHead({
        title: 'WASM Test',
    })

    onMounted(() => {
        console.log('Mounted')
        loadWasm()
    })

    const loadWasm = () => {
        var script = document.createElement('script');
        script.onload = function () {
            const go = new Go();
            WebAssembly.instantiateStreaming(fetch("http://localhost:9000/encryption.wasm"), go.importObject).then((result) => {
                go.run(result.instance);
            });
        };
        script.src = "/wasm/wasm_exec.js";
        document.head.appendChild(script);
    }

    const generateKeys = () => {
        let generatedKeys = generateKeyPairWASM()
        let keys = generatedKeys.split('***')
        privateKey.value = keys[0]
        publicKey.value = keys[1]
        console.log('Private Key: ' + privateKey.value)
        console.log('Public Key: ' + publicKey.value)
    }

    const encryptMessage = () => {
        encryptedMessage.value = encryptWASM(plainMessage.value, publicKey.value)
    }

    const decryptMessage = () => {
        decryptedMessage.value = decryptWASM(encryptedMessage.value, privateKey.value)
    }
</script>
