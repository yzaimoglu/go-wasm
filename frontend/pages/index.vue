<template>
    <div>
        <div class="flex">
            <button @click="createRSAKeypairLocal">RSA KEY GENERATION</button>
            <button @click="createAESKeyLocal">AES KEY GENERATION</button>
            <p>{{ keys.rsa }}</p>
            <p>{{ keys.aes }}</p>
        </div>

        <div>
            <input v-model="plainMessage">
            <p>Encrypted Message: {{ encryptedMessage }}</p>
            <p>Decrypted Message: {{ decryptedMessage }}</p>
            <button @click="encryptMessageAES">Encrypt Message With AES</button>
            <button @click="decryptMessageAES">Decrypt Message With AES</button>
            <button @click="encryptMessageRSA">Encrypt Message With RSA</button>
            <button @click="decryptMessageRSA">Decrypt Message With RSA</button>
        </div>
    </div>
</template>

<script setup>
    import { 
        createRSAKeypair, 
        createAESKey, 
        exportKey, 
        encryptAES, 
        decryptAES, 
        encryptRSA, 
        decryptRSA, 
        importRSAPublicKey, 
        importRSAPrivateKey, 
        importAESKey,
        jwkToBase64,
        base64ToJwk 
    } from '/api/cryptography.js'

    const plainMessage = ref('')
    const encryptedMessage = ref('')
    const decryptedMessage = ref('')

    const keys = ref({
        rsa: {
            publicKey: '',
            privateKey: ''
        },
        aes: {
            key: '',
        }
    })

    const createRSAKeypairLocal = async () => {
        const keypair = await createRSAKeypair()
        keys.value.rsa.publicKey = await exportKey(keypair.publicKey)
        keys.value.rsa.privateKey = await exportKey(keypair.privateKey)
    }

    const createAESKeyLocal = async () => {
        const aesKey = await createAESKey()
        keys.value.aes.key = await exportKey(aesKey)
    }

    const encryptMessageAES = async () => {
        const aesKey = await importAESKey(keys.value.aes.key)
        const encrypted = await encryptAES(aesKey, plainMessage.value)
        encryptedMessage.value = encrypted
    }

    const decryptMessageAES = async () => {
        const aesKey = await importAESKey(keys.value.aes.key)
        const decrypted = await decryptAES(aesKey, encryptedMessage.value)
        decryptedMessage.value = decrypted
    }

    const encryptMessageRSA = async () => {
        const rsaKey = await importRSAPublicKey(keys.value.rsa.publicKey)
        const encrypted = await encryptRSA(rsaKey, plainMessage.value)
        encryptedMessage.value = encrypted
    }

    const decryptMessageRSA = async () => {
        const rsaKey = await importRSAPrivateKey(keys.value.rsa.privateKey)
        const decrypted = await decryptRSA(rsaKey, encryptedMessage.value)
        decryptedMessage.value = decrypted
    }
</script>
