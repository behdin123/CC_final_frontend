<template>
    <div class="update-course-container">

      <div class="update-course-popup">

        <h2>Update Course</h2>

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
            <input v-if="editMode" type="text" v-model="updatedCourse.tagsInput" placeholder="Enter tags separated by commas" />
            <span v-else>{{ course.tags.join(', ') }}</span>
          </label>
  
          <label class="input-label"> Private:
            <input 
                v-if="editMode" 
                type="checkbox" 
                :checked="course.private"
                @change="updatedCourse.private = $event.target.checked"
            />

            <span v-else>{{ course.private ? 'Yes' : 'No' }}</span>
          </label>

          <label class="input-label"> Course Background Image:
            <input v-if="editMode" class="extra-margin" type="file" @change="onFileChange" accept="image/*" />
            <span  v-else class="course-image"></span>
          </label>
          
          <button v-if="editMode" class="button Update-button" @click="updateAndClose">Update Course</button>
          <button v-else class="button button-color" @click="removeCourseAndClose">Remove</button>
  
        <!-- Close button -->
        <button class="close" @click="$emit('update-finished')">x</button>

      </div>

    </div>
  </template>



<script setup>
import { ref, watchEffect, defineProps } from 'vue';

import {
  onFileChange,
  handleUpdateCourse,
  updatedCourse,
  tagsInput,
} from '../../modules/Crud_operator/Course/courseUpdateCrud';

import {
  onUpdateFinishedCourse,  
} from '../../modules/Main_logic/Home';

import { removeCourse } from '../../modules/Crud_operator/Course/courseRemoveCrud';


const props = defineProps({
  course: Object,
});

watchEffect(() => {
  const newCourse = props.course;
  console.log("Course received in openCourseUpdatePopup:", newCourse);
  if (newCourse) {
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

const removeCourseAndClose = async () => {
  await removeCourse(props.course._id);
  onUpdateFinishedCourse();
};


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
    color: var(--tertiary-color);
    width: 45%;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}

.course-description{
    width: 300px;
    text-align: right;
}

.input-label {
    align-items: center;
}

.course-image{
    width: 200px;
    height: 100px;
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
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

</style>