<template>
  <div class="login-entry-div">
    <div v-if="!isLoggedIn" class="entry">
      <a class="open-popup" @click="openPopup(1)"><b>Login</b></a>
      &nbsp; or &nbsp;
      <a class="open-popup" @click="openPopup(2)"><b>Sign up</b></a>
    </div>

    <div v-if="!isLoggedIn" class="separator"></div>

    <div v-if="isLoggedIn" class="entry">
      <a @click="submitLogout">Logout</a>
    </div>

    <div v-if="isLoggedIn" class="separator"></div>
  </div>

  
  <div class="popup-container" v-show="popupVisible" @click.self="closePopup">
    <div class="popup">

      <div class="popup-content">

        <!-- login form -->
        <form id="login-form" v-show="popupContent === 1" @submit.prevent="submitLogin">

          <h2>Login</h2>

          <div class="input-div">

          <p>Username</p>
          <input type="text" v-model="loginUsername">

          <p>Password</p>
          <input type="password" v-model="loginPassword">

          </div>

          <div data-aos="fade-up" data-aos-delay="500" data-aos-duration="1500" class="cta-buttons">
          <button class="cta-button login-button" @click="makeRouterWork()" type="submit">Login</button>
          </div>

        </form>

        <!-- registration form -->
        <form id="register-form" v-show="popupContent === 2" @submit.prevent="submitRegister">

          <h2>Sign up</h2>

          <input type="text" placeholder="Username" v-model="registerUsername">
          <input type="text" placeholder="Mobile" v-model="registerMobile">
          <input type="email" placeholder="Email" v-model="registerEmail">
          <input type="password" placeholder="Password" v-model="registerPassword">
          <input type="password" placeholder="Confirm Password" v-model="registerConfirmPassword">

          <div class="color message" v-if="successMessage">{{ successMessage }}</div>
          <div class="color message" v-if="errorMessage">{{ errorMessage }}</div>

          <button type="submit">Sign up</button>

        </form>

      </div>

      <a class="close-popup" href="#" @click="closePopup">X</a>

    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router';

import {
  popupVisible,
  popupContent,
  openPopup,
  closePopup,
  submitLogin,
  submitRegister,
  submitLogout,
  isLoggedIn,
  errorMessage,
  successMessage,
  loginUsername,
  loginPassword,
  registerUsername,
  registerMobile,
  registerEmail,
  registerPassword,
  registerConfirmPassword
} from '../../modules/Crud_operator/User/login.js';

const router = useRouter();

let makeRouterWork = () => {
/*   if(isLoggedIn === true){ */
    router.push("/Home")
 /*  } */
}


</script>



<style lang="scss" scoped>
@import "@/assets/global.scss";

.login-entry-div {
  display: flex;
  align-items: center;
  color: var(--tertiary-color);
}

.entry a{
  cursor: pointer;
}

.color{
  color: var(--tertiary-color);
}

.message{
  font-size: 30px;
  margin-bottom: 30px;
}

.separator {
  height: 20px;
  border-left: 2px solid var(--tertiary-color);
  margin: 10px 0;
}

.popup-container {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.open-popup{
  cursor: pointer !important;
}

.popup {
  position: relative;
  margin: 6% auto;
  padding: 20px;
  background-color: var(--primary-color);
  width: 80%;
  max-width: 500px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}

.popup h2 {
  margin-top: 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--tertiary-color);
}

.popup input[type="text"],
.popup input[type="email"],
.popup input[type="password"],
.popup button[type="submit"] {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2), -2px -2px 5px rgba(255,255,255,0.5);
  
}

.popup input[type="text"]:focus,
.popup input[type="email"]:focus,
.popup input[type="password"]:focus {
  outline: none;
  border-color: var(--main-button);
}

.popup button[type="submit"] {
  background-color: var(--main-button);
  border: none;
  color: white;
  margin-top: 40px;
  padding: 1.5vh 15px;
  font-size: 24px;
  text-align: center;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.568), -2px -2px 5px rgba(255, 255, 255, 0.728);
}

.popup button:hover{
  background-color: var(--main-button);
}


</style>