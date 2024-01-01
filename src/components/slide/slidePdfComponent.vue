<template>
    <div class="pdf-upload-container">
      <div class="pdf-upload-popup">
        <h2>Upload PDF</h2>
  
        <div class="pdf-upload-content">
          <label for="pdf-upload" class="input-label">Select PDF:
            <input type="file" id="pdf-upload" @change="onPdfChange" accept="application/pdf" />
          </label>
  
          <button class="button Update-button" @click="handlePdfUpload">Upload</button>
        </div>
  
        <!-- Close button -->
        <button class="close" @click="$emit('close')">x</button>
      </div>
    </div>
</template>
  

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import { uploadPdf } from "../../modules/Crud_operator/slide/slideCreateCrud";

import { lessons, fetchLessons, selectedLesson } from '../../modules/Crud_operator/Course/lessons';
import { UpdateAllSlideOrder } from '../../modules/Crud_operator/slide/slideCreateCrud';
import { fetchSlides, slidesByCourse, fetchSlidesByCourse } from '../../modules/Crud_operator/slide/slideGetCrud';

const props = defineProps({
  selectedLesson: String,
  globalIndex: Number,
  courseId: String,
});
const emit = defineEmits(['close']);
const pdfFile = ref(null);

const onPdfChange = (event) => {
  pdfFile.value = event.target.files[0];
  console.log("PDF file selected:", pdfFile.value);
};

  
/*
*
* handlePdfUpload and put the new slides into the correct position in the slide array
*
*/
const handlePdfUpload = async () => {
  // If no pdf choosed, then return
  if (!pdfFile.value) {
    console.error("No PDF file selected");
    return;
  }

  // Upload PDF & create slides
  const newSlides = await uploadPdf(pdfFile.value, props.selectedLesson);

  // If their is no newslides or the length is not more than 0 then return
  if (!newSlides || newSlides.length === 0) {
    return;
  }

  // Fetch the updated slides - to show the new slides
  await fetchSlides(props.selectedLesson);

  // if their is slide in this course, fetch them
  if (slidesByCourse.value.length === 0) {
        await fetchSlidesByCourse(props.courseId);
  }
  console.log("Received globalIndex:", props.globalIndex);
  let position = slidesByCourse.value.findIndex(slide => slide.globalIndex >= props.globalIndex);
  const isLastSlide = position === -1;

  console.log("Initial Position:", position, "Global Index:", props.globalIndex);
  console.log("New Slides:", newSlides);
  console.log("Is Last Slide:", isLastSlide);

  if (isLastSlide) {
    newSlides.forEach(slide => {
      slide.globalIndex = slidesByCourse.value.length + 1;
      slidesByCourse.value.push(slide);
    });
  } else {
    newSlides.forEach((slide, index) => {
      let calculatedPosition = position + index;
      slide.globalIndex = calculatedPosition + 1;
      slidesByCourse.value.splice(calculatedPosition, 0, slide);
      console.log(`Inserting slide at position: ${calculatedPosition}, Global Index: ${slide.globalIndex}`);
    });
  }

  let globalIndexCounter = 1;
  slidesByCourse.value.forEach(slide => {
    slide.globalIndex = globalIndexCounter++;
  });

  console.log("Final slidesByCourse array:", slidesByCourse.value.map(s => s.globalIndex));

  await UpdateAllSlideOrder(slidesByCourse.value);

  emit('close');
};
  
</script>
  

  
<style lang="scss" scoped>
@import "@/assets/global.scss";

.pdf-upload-container {
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

.pdf-upload-popup {
background-color: var(--primary-color);
padding: 2rem;
display: flex;
flex-direction: column;
align-items: center;
position: relative;
color: var(--white-black-color);
width: 30vw;
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
}

.pdf-upload-content {
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
margin-bottom: 1rem;
}

.input-label {
margin: 1rem 0;
}

#pdf-upload {
margin-top: 0.5rem;
}

.button {
margin-top: 1rem;
}
</style>
  