
import { ref } from 'vue';
import { 
    selectedLesson,
} from '../../modules/Crud_operator/Course/lessons';

// Select Lesson (ID)
const selectLesson = (lessonId) => {
    selectedLesson.value = lessonId;
};
  

// Slide Create Popup
const showSlideCreation = ref(false);

function openSlideCreation(lessonId) {
  showSlideCreation.value = true;
  selectedLesson.value = lessonId;
}

const closeSlideCreation = () => {
  showSlideCreation.value = false;
};


// Slide Update Popup
const selectedSlide = ref('');
const showSlideUpdate = ref(false);

function openSlideUpdate(slide) {
  showSlideUpdate.value = true;
  selectedSlide.value = slide;
}

const closeSlideUpdate = () => {
  showSlideUpdate.value = false;
};


// slide PDF popup

const showSlidePdf = ref(null);

const showPdfUpload = () => {
  showSlidePdf.value = true;
};

const closeSlidePdf = () => {
  showSlidePdf.value = false;
};

  

export{
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
};