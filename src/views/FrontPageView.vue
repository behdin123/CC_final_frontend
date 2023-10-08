<template>
    <div class="main">
        <div class="welcome-page">
            <div class="Login-div">
                <div class="size-div">

                    <div class="first-div">

                        <div class="logo">
                            <img v-if="!darkMode" src="@/assets/VIKING-Safety-Academy.png" />
                            <img v-else src="@/assets/VIKING-Safety-Academy-white.png" />
                        </div>

                    </div>

                    <div class="error-message">
                        <div class="message" v-if="errorMessage" 
                        :style="{ 'margin-bottom': errorMessage ? '15px' : '0' }"> ( {{ errorMessage }} ) </div>

                        <div class="color" v-if="successMessage" 
                        :style="{ 'margin-bottom': successMessage ? '15px' : '0' }"> {{ successMessage }} </div>
                    </div>

                    <form @submit.prevent="handleLogin">

                        <div class="input-div">
                            <div class="text-div u-div">
                                <p>Username</p> <b v-if="errorMessage">*</b>
                            </div>
                            <input :class="{ 'input-error': errorMessage }" class="margin" type="text" v-model="loginUsername">

                            <div class="text-div p-div">
                                <p>Password</p> <b v-if="errorMessage">*</b>
                            </div>
                            <input :class="{ 'input-error': errorMessage }" type="password" v-model="loginPassword">
                        </div>

                        <div data-aos="fade-up" data-aos-delay="500" data-aos-duration="1500" class="cta-buttons">
                            <button :class="{ 'button-error': errorMessage, 'button-success': successMessage }" class="cta-button login-button" type="submit">Login</button>
                        </div>

                    </form>

                        <div class="cta-buttons">
                            <button class="cta-button register-button" @click="openPopup(2)">Sign up</button>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import { watch, defineProps } from 'vue';

import { 
    openPopup,
    loginUsername,
    loginPassword,
    submitLogin,
    errorMessage,
    successMessage,
} from '../modules/Crud_operator/User/login.js';

watch(errorMessage, (newValue) => {
    if (newValue) {
        successMessage.value = '';
    }
});

watch(successMessage, (newValue) => {
    if (newValue) {
        errorMessage.value = '';
    }
});

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
});

const router = useRouter();

const handleLogin = async () => {
  const success = await submitLogin(router);
  if (success) {
    router.push("/Home");
  }
}

</script>

<style lang="css" scoped>
.main {
    background-color: var(--main-background);
    height: 93vh;
    display: flex;
    align-content: center;
}

.welcome-page {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0 50px;
    margin-top: 62px !important;
    width: 100%;
}

.Login-div {
    height: 55vh;
    width: 30vw;
    padding: 65px 6%;
    background-color: var(--second-background);
    color: var(--white-black-color);
    display: flex;
    flex-direction: column;
}

.size-div{
    height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.text-div{
    display: flex;
}

.text-div b{
    font-size: 14px;
    margin-left: 3px;
    color: var(--error);
}

.p-div p{
    margin-right: 8px;
}

.u-div p{
    margin-right: 3px;
}

.message{
    color: var(--error) !important;
}

.color{
    color: var(--succes) !important;
}

.first-div{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo{
    width: 11vw;
    height: auto;
    margin-top: 60px;
    margin-bottom: 20px;
}

.logo img {
    width: 100%;
    height: auto;
}

.input-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 30px;
}

.margin{
    margin-bottom: 20px;
}

.input-div p:first-child {
    margin-top: 0;
}

.input-div p {
    font-size: 14px;
}

.Login-div input[type="text"],
.Login-div input[type="password"] {
   display: block;
   width: 100%;
   padding: 2vh 15px;
   border: 1px solid #ccc;
   font-size: 16px;
   box-sizing: border-box;
   box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
}

.Login-div input[type="text"]:focus,
.Login-div input[type="password"]:focus {
   outline: none;
   border-color: var(--main-button);
}

.cta-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.cta-buttons button {
    background-color: var(--main-button);
    border: none;
    color: white;
    margin-bottom: 30px;
    padding: 1.5vh 15px;
    font-size: 24px;
    text-align: center;
    transition: background-color 0.2s ease-in-out;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.568);
}

.button-error {
  background-color: var(--error) !important;
}

.button-error:hover {
  background-color: var(--primary-hover-color) !important;
}

.button-success {
  background-color: var(--main-button);
}

.input-error {
  border: 1px solid var(--error) !important;
}

.cta-button {
    padding: 10px 20px;
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
}

.cta-button:hover {
    background-color: var(--primary-hover-color);
}

/* Til standard desktop skærme */
@media (min-width: 1625px) {
    .Login-div {
        width: 20vw;
        height: 50vh;
    }

    .logo {
        width: 8vw;
        height: auto;
    }

    .cta-buttons button {
    padding: 1.5vh 15px;
    font-size: 26px;
    }
}

/* Til tabletter og små desktop skærme */
@media (max-width: 1024px) and (min-width: 768px) {
    .Login-div {
        margin: 0 15vw;
        width: 45vw;
    }

    .logo {
        width: 20vw;
        height: auto;
    }

    .cta-buttons button {
    padding: 1vh 15px;
    font-size: 24px;
    }
}

/* Til mobilskærme */
@media (max-width: 767px) {
    .Login-div {
        margin: 0 10vw;
        width: 50vw;
    }

    .logo {
        width: 20vw;
        height: auto;
    }
}


</style>