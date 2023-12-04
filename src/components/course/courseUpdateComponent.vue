<template>
    <div class="update-course-container">

      <div v-show="showCropper" class="cropper-popup">
            <img :src="selectedImageUrl" ref="imageSource" />
            <div class="crop-btn-div">
                <button class="button Update-button" @click="cropImage">Crop</button>
                <button class="button" @click="cancelCrop">Cancel</button>
            </div> 
      </div>

      <div class="update-course-popup">

        <h2>Update Course: <b> {{ course.title }}</b></h2>

        <div class="buttons-container">
            <button class="button" @click="toggleEditMode">{{ buttonText }}</button>
        </div>

          <!-- Input fields for editing mode -->

          <label class="input-label"> Title:
            <input v-if="editMode" type="text" v-model="updatedCourse.title" />
            <span  v-else> {{ course.title }} </span>
          </label>
  
          <label class="input-label"> Description:
            <input v-if="editMode" type="text" v-model="updatedCourse.description" />
            <span class="course-description"  v-else> {{ course.description }} </span>
          </label>
  
          <label class="input-label"> Tags:
            <input v-if="editMode" type="text" v-model="tagsInput" placeholder="Enter tags separated by commas" />
            <span v-else>{{ course.tags.join(', ') }}</span>
          </label>
  
          <label class="input-label"> Private:
            <input 
                v-if="editMode" 
                class="checkbox"
                type="checkbox" 
                :checked="course.private"
                @change="updatedCourse.private = $event.target.checked"
            />

            <span v-else>{{ course.private ? 'Yes' : 'No' }}</span>
          </label>

          <label class="input-label"> Course Background Image:

            <div v-if="editMode" class="image-container">
                    <!-- The profile picture -->
                    <img v-if="!course.image" src="@/assets/Image_placeholder.jpg" alt="Profile Picture">

                    <img v-if="course.image && !croppedImageUrl" :src="course.image" alt="Profile Picture" @error="imageError">
                    <img v-if="croppedImageUrl" :src="croppedImageUrl" alt="Profile Picture"  @error="imageError">

                    <div class="overlay">
                      <input class="input uploadBtn" type="file" @change="onFileChange" accept="image/*" ref="fileInput">
                      <div class="text newImage">Upload new Image</div>
                    </div>
            </div>
      
            <span  v-else class="course-image">
              <img :src="course.image" alt="Profile Picture"  @error="imageError">
            </span>

          </label>
          
          <button v-if="editMode" class="button Update-button" @click="updateAndClose">Update Course</button>
          <button v-else class="button button-color" @click="showAlert">Delete</button>
  
        <!-- Close button -->
        <button class="close" @click="$emit('close')">x</button>

      </div>

    <!-- slide Delete popup -->
    <alert-component ref="alertBox" title="Confirm Delete" message="Are you sure to delete this course?" @confirm="confirmDelete"/>

    </div>
  </template>



<script setup>
import { ref, watch, watchEffect, defineProps } from 'vue';

import {
  onFileChange,
  handleUpdateCourse,
  updatedCourse,
  tagsInput,
  showCropper,
  imageSource,
  selectedImageUrl,
  croppedImageUrl,
  cropImage,
  cancelCrop
} from '../../modules/Crud_operator/Course/courseUpdateCrud';

import {
  onUpdateFinishedCourse,  

  // Image placeholder for error in showing a image
  imageError, 
} from '../../modules/Main_logic/Home';

import { removeCourse } from '../../modules/Crud_operator/Course/courseRemoveCrud';
import AlertComponent from '../user/AlertComponent.vue';

// Define the course object (we need the ID) to be able to update or delete the ocurse
const props = defineProps({
  course: Object,
});


// Course remove logic - to make sure that the user wants to delete it or not
const alertBox = ref(null);

const showAlert = () => {
  alertBox.value.show();
};

const confirmDelete = async () => {
  await removeCourse(props.course._id);
  onUpdateFinishedCourse();
};


// watch if the course have been updated then show the new values
watchEffect(() => {
  const newCourse = props.course;
  
  console.log("Course tags:", newCourse.tags);
  console.log("Course received in openCourseUpdatePopup:", newCourse);

  if (newCourse && newCourse.tags) {
    Object.assign(updatedCourse.value, newCourse);
    tagsInput.value = newCourse.tags.join(', ');
  }
});


// handleUpdateCourse and close the popup on update-finished
const updateSuccess = ref(false);

const updateAndClose = async () => {
  updateSuccess.value = await handleUpdateCourse();
};

watchEffect(() => { 
    if (updateSuccess.value) { 
      onUpdateFinishedCourse();
    }
});

// Switch between edit mode and shwo information mode
const editMode = ref(false);
const buttonText = ref('Switch to Edit Mode');

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  buttonText.value = editMode.value ? 'Cancel' : 'Switch to Edit Mode';
};

</script>




<style lang="scss" scoped>

@import "@/assets/global.scss";

.update-course-container {
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

.update-course-popup {
    background-color: var(--primary-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    color: var(--white-black-color);
    width: 30%;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}

span{
  font-weight: bold;
}

.update-course-popup h2{
  font-weight: lighter;
}

.update-course-popup h2 b{
  font-weight: bold;
}

.course-description{
    width: 350px;
    text-align: right;
}

.input-label {
    align-items: center;
}

.course-image{
    width: 150px;
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
}

.course-image img{
  width: 100%;
  height: auto;
}

.buttons-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
}

.button-color{
  background-color: #E53935;
}

@media screen and (max-width: 2000px) {

  .update-course-popup {
    width: 45%;
  }

}

</style>