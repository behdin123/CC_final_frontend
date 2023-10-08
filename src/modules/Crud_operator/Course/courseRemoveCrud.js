import api from '../../../api/courseApi.js';
import { courses } from './courseGetCrud.js';

const removeCourse = async (id) => {
    try {
      await api.removeCourse(id);
      courses.value = courses.value.filter(course => course._id !== id);
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };


export {
removeCourse
};