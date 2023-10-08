
import { removeSlide } from '../../modules/Crud_operator/slide/slideRemoveCrud.js';
import { ref } from 'vue';
import { 
    lessons,
    selectedLesson,
} from '../../modules/columns';

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

const slideRemoved = ref(false);


const removeSlideAndClose = async (slideId) => {
    await removeSlide(slideId);
    slideRemoved.value = !slideRemoved.value;
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
    removeSlideAndClose,
};