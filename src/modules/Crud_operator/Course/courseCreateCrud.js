import { ref } from 'vue';
import api from '../../../api/courseApi.js';


/* 
*
* Create Course 
*
*/

// Create a ref to store the selected image file
let imageFile = ref(null);

// Function to handle the file input change event and update the imageFile ref
const onFileChange = (e) => {
    imageFile.value = e.target.files[0];
};

// Create a ref to store the new course data
let newCourse = ref({
    title: '',
    description: '',
    private: true,
    tags: []
});

// Create a ref to store the input value for tags
let tagsInput = ref('');

// Function to create a new course, update tags and image, and call the API to save the course
const createCourse = async (catalogID) => {
    newCourse.value.tags = tagsInput.value.split(',').map(tag => tag.trim());
    newCourse.value.image = imageFile.value;
    try {
        await api.createCourse(catalogID, newCourse.value);
        return true; // Return success status
    } catch (error) {
        console.error('Error creating course:', error);
        return false; // Return failure status
    }
};


// Export the functions and variabels for use in courseCreateComponent.vue
export {
    createCourse,
    tagsInput,
    newCourse,
    onFileChange,
};