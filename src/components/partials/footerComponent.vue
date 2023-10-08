<template>
    <footer>
            <div class="row">
                <div class="logo-div">
                    <div class="col-md-12 first-child">
                        <p class="mb-0">Powered by</p>
                    </div>
                    <div class="col-md-12">
                        <div class="social-icons">
                            <img v-if="!darkMode" class="logo" src="@/assets/VIKING-Safety-Academy.png" />
                            <img v-else class="logo" src="@/assets/VIKING-Safety-Academy-white.png" />
                        </div>
                    </div>
                </div>
            </div>
    </footer>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
});

</script>

<style lang="scss" scoped>
@import "@/assets/global.scss";

footer {
    background-color: var(--primary-color);
    color: var(--tertiary-color);
    border-top: 1px solid var(--primary-color);
    font-size: 14px;
    min-height: 58px;
}

.row {
    display: flex;
    justify-content: flex-end;
    padding-right: 2%;
    height: 100%;
    align-items: center;
}

.logo-div{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.first-child {
    margin-right: 10px;
}

.social-icons {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-right: 27px;
    display: flex;
    width: 130px;
}

.social-icons img {
    display: inline-block;
    width: 100%;
    height: auto;
    background-size: cover;
}



a::before{
    transform: scaleX(0);
}

a:hover::before{
    transform: scaleX(0) !important;
}

footer p {
    margin: 0;
    text-align: center;
    margin-top: 10px;
}
</style>