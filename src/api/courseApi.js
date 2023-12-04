import axios from 'axios';

export default {


// Create courses
createCourse: async (catalogID, formData) => {
  try {
    const response = await axios.post(`http://localhost:3000/course/create/${catalogID}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Failed to create course:', error);
    throw error;
  }
},



// Get All courses for the user
getAllCourse: async (catalogID) => {
  try {
    const response = await axios.get(`http://localhost:3000/course/list/${catalogID}`, { withCredentials: true });
    console.log('Response from course:', response.data.courses);
    return response.data.courses;
    
  } catch (error) {
    console.error('Failed to fetch course:', error);
    throw error;
  }
},


// Get a single course by ID
getCourseById: async (courseId) => {
  try {
    const response = await axios.get(`http://localhost:3000/course/${courseId}`, { withCredentials: true });
    return response.data.course;
  } catch (error) {
    console.error('Failed to fetch course:', error);
    throw error;
  }
},


// Get columns by course ID
getLessonsByCourseId: async (courseId) => {
  try {
    const response = await axios.get(`http://localhost:3000/course/${courseId}/lessons`, { withCredentials: true });
    console.log('API response:', response.data); // se if the response.data contains the correct values
    return response.data;

  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    throw error;
  }
},


// Remove a course by ID
removeCourse: async (courseId) => {
  try {
    const response = await axios.delete(`http://localhost:3000/course/remove/${courseId}`, { withCredentials: true });
    return response.data;
    
  } catch (error) {
    console.error('Failed to remove course:', error);
    throw error;
  }
},


// Update course information
updateCourse: async (courseId, updatedCourse) => {
  try {
    const response = await axios.put(`http://localhost:3000/course/edit/${courseId}`, updatedCourse, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update course:', error);
    throw error;
  }
},

// Update course image
updateCourseImage: async (courseId, formData) => {
  try {
    const response = await axios.patch(`http://localhost:3000/course/edit-courseImage/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update course image:', error);
    throw error;
  }
},


}