<template >
  <div id="app" :class="{ 'dark-theme': darkMode }">
    <!-- Header section -->
    <navigation-component :toggle-dark-mode="toggleDarkMode" :darkMode="darkMode"/>

    <!-- page view -->
    <RouterView :toggle-dark-mode="toggleDarkMode" :darkMode="darkMode"/>

    <footer-component :toggle-dark-mode="toggleDarkMode" :darkMode="darkMode"/>
  </div>
</template>


<script setup>

import { RouterView } from 'vue-router'
import Cookies from 'js-cookie';
import { isLoggedIn } from './modules/Crud_operator/User/login.js';

// Importing navigation & footer from components
import footerComponent from './components/partials/footerComponent.vue';
import navigationComponent from './components/partials/navigationComponent.vue';

import { ref, watchEffect, onMounted, watch } from 'vue';

// chekcing if their is a token saved as a coockie, and if so it means that the user is logged in and theirfor the isLoggedIn value will be sat to true
onMounted(() => {
  const token = Cookies.get('jwt');
  if (token) {
    isLoggedIn.value = true;
  }
});

watch(isLoggedIn, (newValue) => {
  if (!newValue) {
    // Hvis isLoggedIn er false, fjern token fra cookies
    Cookies.remove('jwt');
  }
});

//Dark Mode
const darkMode = ref(false);

watchEffect(() => {
  localStorage.setItem('darkMode', JSON.stringify(darkMode.value));
});

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

</script>


<style lang="scss">
@import "@/assets/global.scss";


.dark-theme {
  --primary-color: #1d1d1d ;
  --secondary-color: #171C22;
  --tertiary-color: #ffffff;
  --quaternary-color: #3563FF;
  --quaternary-hover-color: #2649ba;
  --primary-hover-color: #97CBD0;
  --background-color: #212121;
  --white-black-color: #ffffff;
  
  --succes: #2B8852;
  --error: #CD1619;
  --main-button: #005968;
  --main-background: #343636;
  --second-background: #252727;
  --container-background: #43464744;



}

</style>
