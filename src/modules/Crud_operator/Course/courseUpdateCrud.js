  import { ref } from 'vue';
  import api from '../../../api/courseApi.js';

  const { updateCourse, updateCourseImage } = api;

  const updatedCourse = ref({
    _id: '',
    title: '',
    description: '',
    private: false,
    tags: [],
    catalog: '',
  });

  const tagsInput = ref('');
  const imageFile = ref(null);

  const onFileChange = (e) => {
    imageFile.value = e.target.files[0];
  };

  const handleUpdateCourse = async () => {
    try {
      updatedCourse.value.tags = tagsInput.value.split(',').map((tag) => tag.trim());
      
      await api.updateCourse(updatedCourse.value._id, updatedCourse.value);
      
      if (imageFile.value) {
        await api.updateCourseImage(updatedCourse.value._id, imageFile.value);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  };

  export {
    onFileChange,
    handleUpdateCourse,
    updatedCourse,
    tagsInput
  }; 