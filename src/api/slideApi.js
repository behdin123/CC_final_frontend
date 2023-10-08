import axios from 'axios';

export default {
  
  createSlide: async (lessonId, slideData) => {
    try {
        const formData = new FormData();
        formData.append('title', slideData.title);
        formData.append('description', slideData.description);
        formData.append('text', slideData.text);
        formData.append('lesson', lessonId);
        
        if (slideData.image) {
            formData.append('image', slideData.image, slideData.image.name);
        }

        const response = await axios.post(`http://localhost:3000/course/lesson/${lessonId}/create`, formData, { withCredentials: true });
        
        return response.data.slide;
      
    } catch (error) {
        console.error('Failed to create slide:', error);
        throw error;
    }
  },

  getSlidesByLesson: async (lessonId) => {
    try {
      const response = await axios.get(`http://localhost:3000/course/lesson/${lessonId}/slides`, { withCredentials: true });
      return response.data.slides;
    } catch (error) {
      console.error('Failed to get slides by lesson:', error);
      throw error;
    }
  },

  getSlideById: async (slideId) => {
    try {
      const response = await axios.get(`http://localhost:3000/course/:courseId/slide/${slideId}`, { withCredentials: true });
      return response.data.slide;
    } catch (error) {
      console.error('Failed to get slide by ID:', error);
      throw error;
    }
  },

  updateSlide: async (slideId, slideData) => {
    console.log('Attempting to update slide with ID:', slideId, 'Data:', slideData);
    try {
      const response = await axios.put(`http://localhost:3000/course/${slideId}/update`, slideData, { withCredentials: true });
      return response.data.slide;
    } catch (error) {
      console.error('Failed to update slide:', error);
      throw error;
    }
  },

  // Update slide image
  updateSlideImage: async (slideId, updatedImage) => {
    try {
      const formData = new FormData();
      formData.append('image', updatedImage, updatedImage.name);

      const response = await axios.patch(`http://localhost:3000/course/edit-slideImage/${slideId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update slide image:', error);
      throw error;
    }
  },

  deleteSlide: async (slideId) => {
    try {
      await axios.delete(`http://localhost:3000/course/${slideId}/delete`, { withCredentials: true });
    } catch (error) {
      console.error('Failed to delete slide:', error);
      throw error;
    }
  },

  updateSlideLesson: async (slideId, lessonId) => {
    try {
      const response = await axios.put(`http://localhost:3000/course/${slideId}/update-lesson`, { lessonId }, { withCredentials: true });
      return response.data.slide;
    } catch (error) {
      console.error('Failed to update slide lesson:', error);
      throw error;
    }
  },

  uploadPdf: async (pdfData) => {
    try {
      const response = await axios.post(`http://localhost:3000/course/slide/upload-pdf`, pdfData, { withCredentials: true });
      return response.data.slides;
    } catch (error) {
      console.error('Failed to upload PDF:', error);
      throw error;
    }
  },

}