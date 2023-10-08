import { ref } from 'vue';
import api from '../../../api/SlideApi.js'; 

const { updateSlide } = api; 

const updatedSlide = ref({
  _id: '',
  title: '',
  description: '',
});


const imageFile = ref(null);

const onFileChange = (e) => {
  imageFile.value = e.target.files[0];
};

const handleUpdateSlide = async (slideData) => {
  try {
    console.log('Updating slide with ID:', slideData._id);
    await api.updateSlide(slideData._id, slideData);
    return true;
  } catch (error) {
    console.error('Error updating slide:', error);
    return false;
  }
};

export {
  onFileChange,
  handleUpdateSlide,
  updatedSlide,
};