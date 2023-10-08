<template>
  <main>
      <div class="main-container"  v-bind:class="{ 'main-container-dark': darkMode }">

        <div class="main-div">

          <div class="course-title">
            <h2>Course Name: <b> {{ course.title }} </b></h2>
            <b class="subtitle">Here you can create, edit and view the course details, such as lessons and slides indside it</b>
          </div>

          <div class="button-div">
            <div class="card">
                <button @click=" openSlideCreation(selectedLesson);">
                  NEW Slide
                  <span class="plus-icon"></span>
                </button>
            </div>
          </div>

          <div class="lesson-div">

            <div class="lesson-part">
              <div class="lesson-container" v-for="lesson in lessons" :key="lesson._id">
                <div class="lesson-list">

                  <div :class="{ 'active-lesson': selectedLesson === lesson._id }" 
                  @click="selectLesson(lesson._id)" class="lesson-header"> 
                  {{ lesson.title }}
                  </div>
              
                </div>
              </div>
            </div>

            <div class="slide-container" v-for="(slide, index) in displayedSlides" :key="slide._id">

                <div class="slide-title-div">
                  <div class="edit icon" @click="openSlideUpdate(slide)">
                    <img src="@/assets/pencil.png" alt="">
                  </div>

                  <div class="slide-title"> {{ index + 1 }}.{{ slide.title }}</div>
                </div>
                
                <div class="edit-icon-div">
                  <div class="icon">
                    <img v-if="!darkMode" src="@/assets/copying.png" alt="">
                    <img v-else src="@/assets/copying-white.png" alt="">
                  </div>

                  <div class="icon">
                    <img v-if="!darkMode" src="@/assets/preview.png" alt="">
                    <img v-else src="@/assets/preview-white.png" alt="">
                  </div>

                  <div @click="removeSlideAndClose(slide._id)" class="icon">
                    <img src="@/assets/trash.png" alt="">
                  </div>
                </div>

            </div>

          </div>

          <div class="line"></div>
 
        </div>

      </div>



    <!-- slide creation popup -->
    <div class="flex">
      <div>
        <slide-create-component @close="closeSlideCreation" :showSlideCreation="showSlideCreation" />
      </div>
    </div>

    <!-- slide update popup -->
    <div class="flex">
      <div>
        <slide-update-component v-if="showSlideUpdate"
        :showSlideUpdate="showSlideUpdate"
        :slide="selectedSlide"
        @close="closeSlideUpdate" />
      </div>
    </div>

   </main>
</template>
  

<script setup>

import { ref, onMounted, defineProps, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api/courseApi';

import {
  fetchSlides,
} from '../../modules/Crud_operator/slide/slideGetCrud';

import { 
  lessons,
  selectedLesson,
/*   drop, 
  dragEnter,
  dragLeave, */
  fetchLessons,
} from '../../modules/columns';

import {
    // select Lesson popup functions & variables
    selectLesson,

    // Create slide popup functions & variables
    showSlideCreation,
    openSlideCreation,
    closeSlideCreation,

    // Update slide popup functions & variables
    selectedSlide,
    showSlideUpdate,
    openSlideUpdate,
    closeSlideUpdate,
    removeSlideAndClose,
} from '../../modules/Main_logic/courseBoard';


import slideCreateComponent from '../slide/slideCreateComponent';
import slideUpdateComponent from '../slide/slideUpdateComponent';


const displayedSlides = computed(() => {
      if(!selectedLesson.value) return [];
  
      const lesson = lessons.value.find(l => l._id === selectedLesson.value);
      
      console.log('Selected Lesson:', lesson);
  
      return lesson ? lesson.slides : [];
});  

const course = ref({});

async function fetchCourse(courseId) {
  try {
    course.value = await api.getCourseById(courseId);
  } catch (error) {
    console.error("Error fetching course:", error);
  }
}

const { id: courseId } = useRoute().params;

onMounted(async () => {
  await fetchCourse(courseId);
  await fetchLessons(courseId); 

  if(lessons.value.length > 0) {
    selectedLesson.value = lessons.value[0]._id;
  }

  for (const lesson of lessons.value) {
    await fetchSlides(lesson._id); 
  }  
});

watch([showSlideCreation, showSlideUpdate], async (newValue, oldValue) => {
  if (!newValue[0] && oldValue[0] || !newValue[1] && oldValue[1]) {
    for (const lesson of lessons.value) {
      await fetchSlides(lesson._id); 
    }  
  }
});

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
});



/* const dropEvent = (event, projectId, columnId) => {
  console.log("Drop event in Vue component: ", event);
  drop(projectId, columnId, event);
}; */
</script>


<style lang="scss" scoped>
@import "@/assets/global.scss";

main {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  min-height: 91.5vh;
  margin-top: 54px !important;
  background-color: var(--main-background);
}

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 65px;
}

.main-div {
  position: relative;
  width: 85vw;
  background-color: var(--second-background);
  color: var(--white-black-color);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  min-height: 500px;
  margin-bottom: 60px;
  padding: 10px 30px 60px 30px;
  
}

.main-div .line {
  position: absolute !important;
  top: 240px;
  left: -5px;
  height: 0.5px;
  width: 94.5%;
}

.slide-container{
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.slide-title-div{
  display: flex;

}

.button-div{
  margin-bottom: 35px;
}

.active-lesson {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  background-color: #414141;
  color: #fff;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  /* display: flex;
  justify-content: center;
  align-items: center; */
}

.course-title {
  padding-bottom: 35px;
}

.course-title h2{
  font-weight: bold;
  font-size: 25px;
  margin-bottom: 10px;
  margin-top: 20px;
  padding-right: 17px;
}

.subtitle{
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
}

.lesson-div{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.lesson-part{
  display: flex;
  justify-content: space-between;
}

.lesson-container{
  width: 20vw;
}

.lesson-header{
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  font-weight: bold;
  cursor: pointer;
  height: 30px; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.lesson-header:hover{
  background-color: #414141c2;
  color: #fff;
}

.edit-icon-div{
  display: flex;
}

.edit-icon-div .icon{
  padding-left: 25px;
}

.icon{
  width: 25px;
  height: auto;
  cursor: pointer;
}

.icon img{
  width: 100%;
  height: auto;
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out; 
}

.icon img:hover{
  opacity: 0.4;
}

.edit{
  margin-right: 15px;
}

.edit img:hover{
  filter: drop-shadow(16px 16px 20px red) invert(75%);
  opacity: 2;
}

.card {
  display: flex;
  justify-content: flex-end !important;
}

.plus {
    display: inline-block;
    font-size: 22px;
    font-weight: 400;
    margin-right: 10px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
}

.board {
    display: flex;
    justify-content: space-between;
    padding: 60px 5%;
    height: 71.3vh !important;
    margin-top: 95px;
    z-index: 1;
    position: relative;
}

.add-card {
    display: flex;
    align-items: center;
    border-radius: 3px;
    color: #000000;
    cursor: pointer;
    margin-bottom: 8px;
    max-width: 320px;
    padding: 8px;
    padding-left: 0 !important;
    margin-top: 10px !important;
    transition: background-color 0.3s ease-in-out;
}

.add-card:hover {
    background-color: var(--primary-hover-color);
    color: #000;
}

</style>