import { ref } from 'vue';
import api from '../../../api/slideApi.js';

// Create a ref to store the selected image file
let imageFile = ref(null);

// Function to handle the file input change event and update the imageFile ref
const onFileChange = (e) => {
    imageFile.value = e.target.files[0];
};

// Create a ref to store the new slide data
let newSlide = ref({
    title: '',
    description: '',
    text: '',
    lesson: '', // Include Lesson ID
});

// Function to create a new slide and call the API to save the slide
const createSlide = async (lessonId) => {
    
    newSlide.value.image = imageFile.value;
    try {
        await api.createSlide(lessonId, newSlide.value);
        return true; // Return success status
    } catch (error) {
        console.error('Error creating slide:', error);
        return false; // Return failure status
    }
};

// Export the functions and variables for use in YourVueComponent.vue
export {
    createSlide,
    newSlide,
    onFileChange,
};