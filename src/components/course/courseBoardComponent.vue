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

                <button class="upload-PDF" @click="showPdfUpload">
                  Upload PDF
                  <img src="@/assets/pdf-file.png" alt="">
                </button>

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

            <div class="slide-info-container">
              <div class="slide-info-box">
                <div class="slide-info-div">
                  <p>Name</p>
                </div>
                <div class="slide-info-div">
                  <p>Description</p>
                </div>
                <div class="slide-info-div">
                  <p>Modified</p>
                </div>
              </div>
              <div class="slide-info-div edit-div">
                <p>Edit</p>
              </div>
            </div>

            <div class="line"></div>

            <div class="slide-container" v-for="slide in displayedSlidesWithGlobalIndex" :key="slide._id">

              <div class="slide-information-printet">

                <div class="slide-title-div slide-value">
                  <div class="edit icon" @click="openSlideUpdate(slide)">
                    <img src="@/assets/pencil.png" alt="">
                    <div class="label">
                      <p>Edit slide</p>
                    </div>
                  </div>

                  <div class="slide-title"> {{ slide.globalIndex }}.{{ slide.title }}</div>
                </div>

                <div class="slide-value slide-description">
                  <p>{{ slide.description }}</p>
                </div>

                <div class="slide-value">
                  {{ new Date(slide.updatedAt).toLocaleDateString() }}
                </div>

              </div>

                
                <div class="edit-icon-div">
                  <div class="icon">
                    
                    <img class="icon-image" v-if="!darkMode" src="@/assets/copying.png" alt="">
                    <img class="icon-image" v-else src="@/assets/copying-white.png" alt="">
                    <div class="label">
                      <p>Copy slide</p>
                    </div>
                  </div>

                  <div class="icon">
                    <img class="icon-image" @click="openSlide(slide, slide.globalIndex)" v-if="!darkMode" src="@/assets/preview.png" alt="">
                    <img class="icon-image" @click="openSlide(slide, slide.globalIndex)" v-else src="@/assets/preview-white.png" alt="">
                    <div class="label">
                      <p>Preview slide</p>
                    </div>
                  </div>

                  <div @click="showAlert(slide._id)" class="icon">
                    <img class="icon-image" src="@/assets/trash.png" alt="">
                    <div class="label">
                      <p>Delete slide</p>
                    </div>
                  </div>
                </div>

            </div>

          </div>
 
        </div>

      </div>



    <!-- slide creation popup -->
    <div class="flex">
      <div>
        <slide-create-component @close="closeSlideCreation" 
        :showSlideCreation="showSlideCreation" 
        :globalIndex="GlobalIndexForSlide()" 
        :lessonId="currentLessonId" 
        :courseId="courseId"/>
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

    <!-- slide Pdf popup -->
    <div class="flex">
      <div>
        <slide-pdf-component v-if="showSlidePdf"
        :selectedLesson="selectedLesson"
        :globalIndex="GlobalIndexForSlide()"
        :courseId="courseId"
        @close="closeSlidePdf" />
      </div>
    </div>

     <!-- slide Delete popup -->
    <alert-component ref="alertBox" title="Confirm Delete" message="This action cannot be undone and the File will be deleted permanently." @confirm="confirmDelete"/>

   </main>
</template>
  

<script setup>

import { ref, onMounted, defineProps, watch, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import api from '../../api/courseApi';

// popups import
import slideCreateComponent from '../slide/slideCreateComponent.vue';
import slideUpdateComponent from '../slide/slideUpdateComponent.vue';
import SlidePdfComponent from '../slide/slidePdfComponent.vue';
import AlertComponent from '../user/AlertComponent.vue';

import {
  fetchSlides,
} from '../../modules/Crud_operator/slide/slideGetCrud';

import { 
  lessons,
  selectedLesson,
  fetchLessons,
} from '../../modules/lessons';

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

    // slide PDF popup
    showSlidePdf,
    showPdfUpload,
    closeSlidePdf,
} from '../../modules/Main_logic/courseBoard';

import { removeSlide } from '../../modules/Crud_operator/slide/slideRemoveCrud.js';
import { fetchSlidesByCourse } from "../../modules/Crud_operator/slide/slideGetCrud";



// slide remove logic
const alertBox = ref(null);
const selectedSlideId = ref(null);

const showAlert = (slideId) => {
  selectedSlideId.value = slideId;
  alertBox.value.show();
};

const confirmDelete = async () => {
  if (selectedSlideId.value) {
    await removeSlide(selectedSlideId.value);

    // Update slides for the chossen lesson after the slide is deleted
    // To show that the slide is deleted "to the user"
    if (selectedLesson.value) {
      await fetchSlides(selectedLesson.value);
    }

    // Fetch slides for the whole course
    // To be able to create new slides without problem for the order and its global Index 
     await fetchSlidesByCourse(courseId);
  }
};




// Total slides which is beofre the new slides which we gonna create
const totalSlidesBeforeLesson = (lessonId) => {
  const lessonIndex = lessons.value.findIndex(l => l._id === lessonId);
  if (lessonIndex <= 0) return 0;
  
  return lessons.value
         .slice(0, lessonIndex)
         .reduce((acc, lesson) => acc + lesson.slides.length, 0);
};


// Find the existing slides for the lesson and taking the Total slides before it and then calculate the new index for the new slide
const displayedSlidesWithGlobalIndex = computed(() => {
  if (!selectedLesson.value) return [];

  const lesson = lessons.value.find(l => l._id === selectedLesson.value);

  if (!lesson || !lesson.slides) {
        // If no slides, return empty array
        return [];
    }

    const offset = totalSlidesBeforeLesson(selectedLesson.value);
    return lesson.slides.map((slide, index) => ({ ...slide, globalIndex: index + 1 + offset }));
});



// A function to calculate index fot the new slide to use for the slide array in backend (making the order in slideCreateComponent.vue)
const GlobalIndexForSlide = () => {
  const totalBefore = totalSlidesBeforeLesson(selectedLesson.value);
  return totalBefore + displayedSlidesWithGlobalIndex.value.length + 1;
};




// Chosen lesson ID (Introduction, Main, Question)
const currentLessonId = ref('');

// Update currentLessonId, when component is mounted
onMounted(() => {
  currentLessonId.value = selectedLesson.value;
});

// Update currentLessonId, when a new lesson is selected
watch(selectedLesson, (newLesson) => {
  currentLessonId.value = newLesson;
});

// Fetch slides whenever the selected lesson changes
watchEffect(() => {
  if (selectedLesson.value) {
    fetchSlides(selectedLesson.value);
  }
});



// Current course ID & object
const course = ref({});
const { id: courseId } = useRoute().params;

// Fetch course data based on course ID
async function fetchCourse(courseId) {
  try {
    course.value = await api.getCourseById(courseId);
  } catch (error) {
    console.error("Error fetching course:", error);
  }
}

// Fetch course and lessons data when component is mounted
onMounted(async () => {
  await fetchCourse(courseId);
  await fetchLessons(courseId); 

  // Auto select the first lesson (Introduction)
  if(lessons.value.length > 0) {
    selectedLesson.value = lessons.value[0]._id;
  }

  // Fetch slides for all lessons
  for (const lesson of lessons.value) {
    await fetchSlides(lesson._id); 
  }  
});

// Watch slide creation & update - fetch slides and show the new created slide after slide creation
watch([showSlideCreation, showSlideUpdate], async (newValue, oldValue) => {
  if (!newValue[0] && oldValue[0] || !newValue[1] && oldValue[1]) {
    for (const lesson of lessons.value) {
      await fetchSlides(lesson._id); 
    }  
  }
});


// Slide content edit open (slideBoardComponent) logic
const useRouterCustom = () => {
  const router = useRouter();

  // To open a course interface and edit the content inside the course overview
  const openSlide = (slide, globalIndex) => {
    router.push({ name: 'SlideBoard', params: { id: slide._id, courseId: courseId, globalIndex: globalIndex} });
  };
  return {
    openSlide
  }
}
const { openSlide } = useRouterCustom();



const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
});
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
  padding-top: 40px;
}

.main-div {
  position: relative;
  width: 85vw;
  background-color: var(--second-background);
  color: var(--white-black-color);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  min-height: 70vh;
  margin-bottom: 60px;
  padding: 10px 30px 60px 30px;
}

.main-div .line {
  position: absolute !important;
  top: 100px;
  margin-left: 0 !important;
  height: 0.5px;
  width: 85vw;
}

.slide-info-container{
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.edit-div{
  display: flex;
  justify-content: flex-end;
  padding-right: 48px !important;
  width: 8% !important;
}

.slide-info-box{
  display: flex;
  width: 84%;
}

.slide-info-div{
  padding-right: 3%;
  width: 30%;
}
 
.slide-container{
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.slide-information-printet{
  display: flex;
  width: 84%;
}

.slide-value{
  padding-right: 3%;
  width: 33%;
  box-sizing: border-box;
}

.slide-description p{
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
  margin-right: 30%;
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
  padding-bottom: 10px;
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
  position: relative;
}

.lesson-part{
  display: flex;
  justify-content: space-between;
  background: #707070;
  color: #fff;
  margin-bottom: 20px;
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
  background-color: #333;
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
  position: relative;
}

.icon img:hover ~ .label {
  opacity: 1;
  height: 30px;
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

.upload-PDF{
  margin-right: 40px;
}

.upload-PDF img{
  margin-left: 20px;
  width: 25px;
  height: 25px;
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