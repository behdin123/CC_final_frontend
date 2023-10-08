<template>

    <div class="create-course-container" v-if="showCourseCreation">

        <div class="create-course-popup">

            <h2>Create New Course</h2>

            <label class="input-label"> Title:
                <input type="text" v-model="newCourse.title" />
            </label>

            <label class="input-label"> Description:
                <input type="text" v-model="newCourse.description" />
            </label>

            <label class="input-label"> Image:
                <input class="extra-margin" type="file" @change="onFileChange" accept="image/*"/>
            </label>

            <label class="input-label"> Tags:
                <input type="text" v-model="tagsInput" placeholder="Enter tags separated by commas" />
            </label>

            <label class="input-label"> Private:
                <input type="checkbox" v-model="newCourse.private" />
            </label>

            <button class="button Update-button" @click="handleCreateCourse">Create Course</button>

            <!-- The close button -->
            <button class="close" @click="$emit('close')">x</button>

        </div>

    </div>

</template>


<script setup>
import {
    createCourse,
    tagsInput,
    newCourse,
    onFileChange,
} from '../../modules/Crud_operator/Course/courseCreateCrud';

import { selectedCatalogID } from '../../modules/Main_logic/Home';

// Tilføj 'defineProps' import
import { defineProps, defineEmits } from 'vue';

// Definer 'showCourseCreation' prop
const props = defineProps({
  showCourseCreation: Boolean,
});

const emit = defineEmits(['close']);

const handleCreateCourse = async () => {
  console.log("Selected Catalog ID:", selectedCatalogID.value);
  const isSuccess = await createCourse(selectedCatalogID.value);
  if (isSuccess) {
    emit('close');  
  }
};

</script>

<style lang="scss">
@import "@/assets/global.scss";

/* Styling for the popup */
.create-course-container {
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

.create-course-popup {
    background-color: var(--primary-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 30%;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
}

.create-course-popup h2{
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

.extra-margin{
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

.button:hover {
    background-color: var(--primary-hover-color);
    color: #000;
}
</style>
