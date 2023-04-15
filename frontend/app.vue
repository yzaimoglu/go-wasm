<template>
  <div>
    <div v-if="loaded">
      <Html :class='[!loaded ? "dark" : 0]' ></Html>
      <NuxtLayout>
        <NuxtPage class="dark:bg-gray-900" />
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
</style>

<script setup>
  import { darkMode } from '/utilities/darkMode.js'

  const loaded = ref(false)
  const darkModePreference = useState('darkModePreference', () => true)

  onBeforeMount(() => {
    darkModePreference.value = localStorage.getItem('theme') === 'dark' ? true : false
    darkMode()
    setTimeout(() => {
      loaded.value = true
      window.onerror = function(e){
          if(e.includes("NotFoundError:")){
            document.location.reload()
          return true;
        }
      }
    }, 150)
  })


  useHead({
    link: [
      {
        rel: "stylesheet",
        href: "/styles/tailwind.css",
      },
    ],
  });
</script>
