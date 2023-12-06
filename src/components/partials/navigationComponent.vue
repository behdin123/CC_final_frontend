<template>
  <header>
    <img v-if="!darkMode" @click="goToHome" class="logo" src="@/assets/VIKING-Safety-Academy.png" />
    <img v-else @click="goToHome" class="logo" src="@/assets/VIKING-Safety-Academy-white.png" />
    <div class="wrapper">
      <!-- Navigation -->
      <nav>

        <!-- <div class="nav-links">
          <RouterLink to="/">Frontpage</RouterLink>
          <RouterLink v-if="isLoggedIn" to="/Home">Home</RouterLink>
        </div> -->

        <!-- login & register & logout -->
        <div class="login-div" v-bind:class="{ 'login-div-loggedin': isLoggedIn }">
          <login-component />
        </div>

        <div class="user-short" v-if="isLoggedIn" @click="showPopup = !showPopup">
          <img v-if="!profile_image" src="@/assets/profile-placeholder.png" alt="Profile Picture" class="user-short__img">
          <img v-else :src="profile_image" alt="Profile Picture" class="user-short__img"  @error="imageError">
          <p class="user-short-name">{{ capitalizedUsername() }}</p>
        </div>

        <div v-if="showPopup">
           <UserProfileComponent />
        </div>

        <label class="switch">
          <input @click="toggleDarkMode" type="checkbox"/>
          <span class="slider round"></span>
        </label>

      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, defineProps, watch} from 'vue';
import LoginComponent from '../user/loginComponent.vue';
import UserProfileComponent from '../user/userProfileComponent.vue';
import { useRouter } from 'vue-router';

import { isLoggedIn } from '../../modules/Crud_operator/User/login.js';

import { capitalizedUsername, showPopup, imageError } from '../../modules/Main_logic/UserProfile';

import { profile_image } from '../../modules/Crud_operator/User/userGetCrud'


const components = {
  LoginComponent,
  UserProfileComponent,
}; 

const props = defineProps({
  title: {
    type: Boolean,
    required: false,
  },
  toggleDarkMode: Function,
  darkMode: Boolean,
});

const router = useRouter();

// Navigation control to go back to course overview from the slide preview
const goToHome = () => {
    router.push({ name: 'Home'}); 
};

//checking if the user is logged out then it should be send back to the frontpage
watch(isLoggedIn, (newIsLoggedIn) => {
  if (!newIsLoggedIn) {
    router.push('/');
  }
});

watch(isLoggedIn, (newIsLoggedIn) => {
    if (newIsLoggedIn) {
      router.push('/Home');
    }
});

</script>




<style lang="scss">
@import "@/assets/global.scss";

nav{
  position: relative;
}

.share{
  margin-right: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 23%;
  left: 95.5%;
  right: 0;
  bottom: 0;
  background-color: var(--main-button);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--primary-hover-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px #D9C4A9;
}

input:checked + .slider:before {
  -webkit-transform: translateX(calc(90%));
  -ms-transform: translateX(calc(90%));
  transform: translateX(calc(100%));
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
  width: 4.7em;
  height: 55%;
}

.slider.round:before {
  border-radius: 50%;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  justify-content: space-between;
  padding: 0 5%;
  font-size: 13px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--primary-color);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
  z-index: 999;
}

a:link {
  text-decoration: none;
}

.nav-links {
  margin-right: 50px;
}

.login-div{
  margin-right: 100px;
}

.login-div-loggedin{
  margin-right: 20px !important;
}

.user-short {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 5%;
  transition: opacity 0.3s;
}
 
.user-short:hover{
  opacity: 0.6;
}

.user-short__img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.user-short-name{
  font-weight: bold;
  color: var(--white-black-color);
}

.user-short-name:first-letter{
  text-transform: capitalize !important;
}

header a {
  position: relative;
  color: var(--white-black-color);
  text-decoration: none;

}

a:hover {
  opacity: 0.6;
}

a::before {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  color: var(--white-black-color);
  transform: scaleX(0);
  transition: transform 0.2s ease-in-out;
}

a:hover::before {
  transform: scaleX(1);
  color: var(--main-button);
}

.logo {
  display: flex;
  width: auto;
  height: 50px;
  padding: 5px 0;
  cursor: pointer;
}

.wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}
</style>