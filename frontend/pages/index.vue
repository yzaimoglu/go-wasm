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
        
        <div>
            <p>Encrypted AES Key: {{ encryptedAESKey }}</p>
            <p>Decrypted AES Key: {{ decryptedAESKey }}</p>
            <button @click="encryptAESKeyLocal">Encrypt AES Key With RSA</button>
            <button @click="decryptAESKeyLocal">Decrypt AES Key With RSA</button>
        </div>

        <!-- file input -->
        <div>
            <input id="file_upload" type="file" @change="onFileChange" />
            <button @click="encryptFile">Encrypt File</button>
            <button @click="decryptFile">Decrypt File</button>
            <button @click="downloadDecryptedFile">Download Decrypted File</button>
        </div>

        <!-- image input -->
        <div>
            <input id="image_upload" accept="image/png, image/jpeg" type="file" @change="onImageChange" />
            <button @click="encryptImage">Encrypt Image</button>
            <button @click="decryptImage">Decrypt Image</button>
            <button @click="downloadDecryptedImage">Download Decrypted Image</button>
            <button @click="setImageSource">Set Image Source</button>
        </div>

        <img id="decrypted_image">
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
        encryptAESKey,
        decryptAESKey
    } from '/api/cryptography.js'

    // Messages
    const plainMessage = ref('')
    const encryptedMessage = ref('')
    const decryptedMessage = ref('')

    // Files
    const plainFile = ref({
        data: null,
        done: false
    })
    const encryptedFile = ref('')
    const decryptedFile = ref('')

    // Images
    const plainImage = ref({
        data: null,
        done: false
    })
    const encryptedImage = ref('')
    const decryptedImage = ref('')

    const imageSource = ref('')


    // Keys
    const keys = ref({
        rsa: {
            publicKey: '',
            privateKey: ''
        },
        aes: {
            key: '',
        }
    })
    const encryptedAESKey = ref('')
    const decryptedAESKey = ref('')

    // Key Generation
    const createRSAKeypairLocal = async () => {
        const keypair = await createRSAKeypair()
        keys.value.rsa.publicKey = await exportKey(keypair.publicKey)
        keys.value.rsa.privateKey = await exportKey(keypair.privateKey)
    }

    const createAESKeyLocal = async () => {
        const aesKey = await createAESKey()
        keys.value.aes.key = await exportKey(aesKey)
    }

    // AES Message
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

    // RSA Message
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

    // AES Key
    const encryptAESKeyLocal = async () => {
        const rsaKey = await importRSAPublicKey(keys.value.rsa.publicKey)
        const aesKey = await importAESKey(keys.value.aes.key)
        const encrypted = await encryptAESKey(rsaKey, aesKey)
        encryptedAESKey.value = encrypted
    }

    const decryptAESKeyLocal = async () => {
        const rsaKey = await importRSAPrivateKey(keys.value.rsa.privateKey)
        const decrypted = await decryptAESKey(rsaKey, encryptedAESKey.value)
        decryptedAESKey.value = decrypted
    }

    // Files
    const onFileChange = async () => {
        const uploadedFile = document.getElementById('file_upload').files[0]
        const reader = new FileReader()
        reader.readAsDataURL(uploadedFile)
        reader.onload = () => {
            plainFile.value.done = true
            plainFile.value.data = reader.result
        }
    }

    const encryptFile = async () => {
        if (!plainFile.value.done) {
            console.log('File upload has not been completed yet')
            return
        }
        const aesKey = await importAESKey(keys.value.aes.key)
        const encrypted = await encryptAES(aesKey, plainFile.value.data)
        encryptedFile.value = encrypted
        console.log(encryptedFile.value)
    }

    const decryptFile = async () => {
        if (!plainFile.value.done && !encryptedFile.value !== '') {
            console.log('File upload has not been completed yet')
            return
        }
        const aesKey = await importAESKey(keys.value.aes.key)
        const decrypted = await decryptAES(aesKey, encryptedFile.value)
        decryptedFile.value = decrypted
        console.log(decryptedFile.value)
    }

    const downloadDecryptedFile = async () => {
        if (!plainFile.value.done && !encryptedFile.value !== '' && !decryptedFile.value !== '') {
            console.log('File upload has not been completed yet')
            return
        }
        const link = document.createElement('a')
        link.href = decryptedFile.value
        link.download = 'download'
        link.click()
    }

    // Images
    const onImageChange = async () => {
        const uploadedImage = document.getElementById('image_upload').files[0]
        const reader = new FileReader()
        reader.readAsDataURL(uploadedImage)
        reader.onload = () => {
            plainImage.value.done = true
            plainImage.value.data = reader.result
        }
    }

    const encryptImage = async () => {
        if (!plainImage.value.done) {
            console.log('Image upload has not been completed yet')
            return
        }
        const aesKey = await importAESKey(keys.value.aes.key)
        const encrypted = await encryptAES(aesKey, plainImage.value.data)
        encryptedImage.value = encrypted
        console.log(encryptedImage.value)
    }

    const decryptImage = async () => {
        if (!plainImage.value.done && !encryptedImage.value !== '') {
            console.log('Image upload has not been completed yet')
            return
        }
        const aesKey = await importAESKey(keys.value.aes.key)
        const decrypted = await decryptAES(aesKey, encryptedImage.value)
        decryptedImage.value = decrypted
        console.log(decryptedImage.value)
    }

    const downloadDecryptedImage = async () => {
        if (!plainImage.value.done && !encryptedImage.value !== '' && !decryptedImage.value !== '') {
            console.log('Image upload has not been completed yet')
            return
        }
        const link = document.createElement('a')
        link.href = decryptedImage.value
        link.download = 'download'
        link.click()
    }

    const setImageSource = async () => {
        if (!plainImage.value.done && !encryptedImage.value !== '' && !decryptedImage.value !== '') {
            console.log('Image upload has not been completed yet')
            return
        }
        imageSource.value = decryptedImage.value
        document.getElementById('decrypted_image').setAttribute('src', imageSource.value)
    }

</script>

