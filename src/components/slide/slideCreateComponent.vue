<template>
    <div class="create-slide-container" v-if="showSlideCreation">
        <div class="create-slide-popup">
            <h2>Create New Slide</h2>
            <label class="input-label"> Title:
                <input type="text" v-model="newSlide.title" />
            </label>
            <label class="input-label"> Description:
                <input type="text" v-model="newSlide.description" />
            </label>
            <label class="input-label"> Text:
                <input type="text" v-model="newSlide.text" />
            </label>
            <label class="input-label"> Image:
                <input class="extra-margin" type="file" @change="onFileChange" accept="image/*"/>
            </label>
            <button class="button Update-button" @click="handleCreateSlide">Create Slide</button>
            <button class="close" @click="$emit('close')">x</button>
        </div>
    </div>
</template>

<script setup>
import {
    createSlide,
    newSlide,
    onFileChange,
} from '../../modules/Crud_operator/slide/slideCreateCrud';



import { defineProps, defineEmits } from 'vue';

import { 
  selectedLesson 
} from '../../modules/columns';

const props = defineProps({
  showSlideCreation: Boolean,
});

const emit = defineEmits(['close']);

const handleCreateSlide = async () => {
  const isSuccess = await createSlide(selectedLesson.value); 
  if (isSuccess) {
    emit('close');  
  }
};

</script>

<style lang="scss">
@import "@/assets/global.scss";

.create-slide-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.create-slide-popup {
    background-color: var(--primary-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 30%;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
}

.create-slide-popup h2{
    margin-top: 0;
    margin-bottom: 40px;
    color: var(--white-black-color);
}

.input-label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: var(--white-black-color);
    margin: 10px;
}

.extra-margin {
    width: 32%;
}

.button {
    background-color: var(--quaternary-color);
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    padding: 12px 30px;
    transition: background-color 0.2s ease-in-out;
    margin-top: 1rem;
}
</style>