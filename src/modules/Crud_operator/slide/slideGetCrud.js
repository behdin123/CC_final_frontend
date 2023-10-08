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

export {
  slides,
  fetchSlides,
};