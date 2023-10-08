import { ref } from 'vue';
import api from '../../../api/courseApi.js';

/* 
*
* Get Course 
*
*/

const courses = ref([]);

const fetchCourses = async (catalogID) => {
  try {
    const fetchCourses = await api.getAllCourse(catalogID);
    fetchCourses.forEach(course => course.catalogID = catalogID);
    fetchCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return fetchCourses;

  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}; 

 export {
  courses,
  fetchCourses,
};