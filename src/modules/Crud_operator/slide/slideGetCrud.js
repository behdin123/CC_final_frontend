import { ref } from 'vue';
import api from '../../../api/slideApi.js';

import { 
    lessons,
  } from '../../Crud_operator/Course/lessons.js';

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
    console.log(`Henter slides for kursus-ID: ${courseId}`);
    const fetchedSlides = await api.getSlidesByCourse(courseId);
    slidesByCourse.value = fetchedSlides || [];
    console.log(`Hentede slides for kursus:`, fetchedSlides);
    return fetchedSlides; // Tilføjer denne linje
  } catch (error) {
    console.error('Error fetching slides by course:', error);
    slidesByCourse.value = [];
  }
};

export {
  slides,
  fetchSlides,
  fetchSlideById,
  slidesByCourse,
  fetchSlidesByCourse,
};