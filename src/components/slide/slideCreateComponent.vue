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
            <button class="button Update-button" @click="createAndOrderNewSlide">Create Slide</button>
            <button class="close" @click="$emit('close')">x</button>
        </div>
    </div>
</template>

<script setup>
import {
    createSlide,
    newSlide,
    onFileChange,
    UpdateAllSlideOrder,
} from '../../modules/Crud_operator/slide/slideCreateCrud';

import {
  slidesByCourse, fetchSlidesByCourse
} from "../../modules/Crud_operator/slide/slideGetCrud";

import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  showSlideCreation: Boolean,
  globalIndex: Number,
  lessonId: String,
  courseId: String,
});
const emit = defineEmits(['close']);



const createAndOrderNewSlide = async () => {
  // if their is slide in this course, fetch them
  if (slidesByCourse.value.length === 0) {
        await fetchSlidesByCourse(props.courseId);
  }
  // create new slide in the chosen lesson
  const createdSlide = await createSlide(props.lessonId);

  // If the new slide not can be created the function gonna stop here and return
  if (!createdSlide) { return }


  // Tildel globalIndex for eksisterende slides
  slidesByCourse.value.forEach((slide, index) => {
    slide.globalIndex = index + 1;
  });

  // slide is created then find position in the the array with its globalIndex 
  const position = slidesByCourse.value.findIndex(slide => slide.globalIndex >= props.globalIndex);
  // position -1, means that no existing slides have a higher or equal globalIndex
  const isLastSlide = position === -1;

  // If isLastSlide is true for the new slide, then set it in the end of the array / Else find its position
  if (isLastSlide) {
    slidesByCourse.value.push({ ...createdSlide, globalIndex: slidesByCourse.value.length + 1 });
  } else {
    slidesByCourse.value.splice(position, 0, { ...createdSlide, globalIndex: props.globalIndex });
  }

  // Recalculate globalIndex and order for all slides
  let globalIndexCounter = 1;
    for (const slide of slidesByCourse.value) {
        if (slide._id === createdSlide._id) {                                                   //The new slide should have the globalIndex as the order in the array
            slide.globalIndex = isLastSlide ? slidesByCourse.value.length : props.globalIndex;  // If it is the last slide, use the length of the array, otherwise use the original globalIndex
        } else {
            if (globalIndexCounter >= props.globalIndex && slide._id !== createdSlide._id) {    // The slides which have a already bigger or a equal globalIndex as the new created slide gonna be + 1 in their order
            slide.globalIndex = globalIndexCounter + 1;
            } else {                                                                            // The slides which have lower order then the new created slide should just be the same in their order
            slide.globalIndex = globalIndexCounter;
            }
        }
    globalIndexCounter++;
  }

  // Update the new created slides order with the globalIndex
  await UpdateAllSlideOrder(slidesByCourse.value);
  emit('close');
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
    align-items: center;
    color: var(--white-black-color);
    margin: 10px;
}

.extra-margin {
    width: 32%;
}

.button {
    background-color: var(--main-button);
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    padding: 12px 30px;
    transition: background-color 0.2s ease-in-out;
    margin-top: 1rem;
}
</style>