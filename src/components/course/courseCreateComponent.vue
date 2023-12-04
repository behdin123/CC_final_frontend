<template>

    <div class="create-course-container" v-if="showCourseCreation">

        <div v-show="showCropper" class="cropper-popup">
            <img :src="selectedImageUrl" ref="imageSource" />
            <div class="crop-btn-div">
                <button class="button Update-button" @click="cropImage">Crop</button>
                <button class="button" @click="cancelCrop">Cancel</button>
            </div> 
        </div>

        <div class="create-course-popup">

            <h2>Create New Course</h2>

            <label class="input-label"> Title:
                <input type="text" v-model="newCourse.title" />
            </label>

            <label class="input-label"> Description:
                <input type="text" v-model="newCourse.description" />
            </label>

            <label class="input-label course"> 
                <div class="course-tag-div">
                    Tags:
                    <img src="@/assets/WebNote.png" alt="">
                    <div class="label">
                        <p>Enter Tags with "comma" </p>
                        <p>Example: one, two, three</p>
                    </div>
                </div>
                <input type="text" v-model="tagsInput" placeholder="tag1, tag2" />
            </label>

            <label class="input-label"> Private:
                <input class="checkbox" type="checkbox" v-model="newCourse.private" />
            </label>

            <label class="input-label image-label"> Image:
                <div class="image-container">
                    <!-- The profile picture -->
                    <img v-if="!croppedImageUrl" src="@/assets/Image_placeholder.jpg" alt="Profile Picture">
                    <img v-else :src="croppedImageUrl" alt="Profile Picture"  @error="imageError">
                    <div class="overlay">
                      <input class="input uploadBtn" type="file" @change="onFileChange" accept="image/*" ref="fileInput">
                      <div class="text newImage" @click="promptFileUpload">Upload new Image</div>
                    </div>
                </div>
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
    showCropper,
    imageSource,
    croppedImageUrl,
    selectedImageUrl,
    cropImage, 
    cancelCrop, 
} from '../../modules/Crud_operator/Course/courseCreateCrud';

import { 
  selectedCatalogID, 
  
  // Image placeholder for error in showing a image
  imageError, 

} from '../../modules/Main_logic/Home';

// Tilføj 'defineProps' import
import { ref, defineProps, defineEmits } from 'vue';


// Definer 'showCourseCreation' prop
const props = defineProps({
  showCourseCreation: Boolean,
});

const emit = defineEmits(['close']);

const handleCreateCourse = async () => {
  console.log("Tags før oprettelse:", tagsInput.value);
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
    align-items: center;
}

.extra-margin{
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

.button:hover {
    background-color: var(--primary-hover-color);
    color: #000;
}

.image-container {
  position: relative;
  max-height: 10rem;
  cursor: pointer;
}

/* Styling for the course picture */
.image-container img {
  max-width: 100%;
  max-height: 10rem;
  margin-bottom: 1rem;
}

.image-container:hover .overlay {
  opacity: 1;
}

.image-label{
  display: flex;
  align-items: center;
}

.course-tag-div img{
    width: auto;
    height: 20px;
    margin-left: 10px;
    z-index: 100;
    cursor: pointer;
}

.course-tag-div{
    display: flex;
    align-items: center;
    position: relative;
}


.course-tag-div .label{
    width: 250px;
    flex-direction: column;
    text-align: left;
    align-items: flex-start !important;
}


.course-tag-div img:hover ~ .label {
    opacity: 1;
    height: 95px;
}

.course-tag-div .label p{
    margin: 0;
    padding-left: 10px;
    padding-bottom: 10px;
}

@media screen and (max-width: 2000px) {

.create-course-popup {
  width: 45%;
}

}
</style>
