import { ref } from 'vue';
import api from '../../../api/slideApi.js';

import { 
    lessons,
  } from '../../columns';

/* 
*
* Get Slides 
*
*/

const slides = ref([]);  

const fetchSlides = async (lessonId) => {
    try {
      const fetchedSlides = await api.getSlidesByLesson(lessonId); 

      const lesson = lessons.value.find(lesson => lesson._id === lessonId);
        if(lesson) {
            lesson.slides = fetchedSlides;
        } else {
            console.error('No lesson found with id:', lessonId);
        }


    } catch (error) {
      console.error('Error fetching slides:', error);
    }
}; 

const fetchSlideById = async (slideId) => {
  try {
    const fetchedSlide = await api.getSlideById(slideId); 
    return fetchedSlide;

  } catch (error) {
    console.error('Error fetching slide by ID:', error);
    throw error;
  }
}; 


const slidesByCourse = ref([]);

const fetchSlidesByCourse = async (courseId) => {
  try {
    const fetchedSlides = await api.getSlidesByCourse(courseId);
    slidesByCourse.value = fetchedSlides;
    return fetchedSlides; // Tilføjer denne linje
  } catch (error) {
    console.error('Error fetching slides by course:', error);
    throw error;
  }
};

export {
  slides,
  fetchSlides,
  fetchSlideById,
  slidesByCourse,
  fetchSlidesByCourse,
};