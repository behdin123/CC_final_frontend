import { ref, computed } from 'vue';
import api from '../../../api/courseApi.js';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';


/* 
*
* Create Course 
*
*/

// course values
let newCourse = ref({
    title: '',
    description: '',
    private: true,
    tags: []
});

let tagsInput = ref('');




// Cropper values and setup 
let selectedImage = ref(null); 
let showCropper = ref(false); 
let imageSource = ref(null); 
let cropper = null; 

const selectedImageUrl = computed(() => {
    return selectedImage.value ? URL.createObjectURL(selectedImage.value) : '';
});
  
// Cropper onFileChange function for choosing the image and showing the cropper
const onFileChange = (e) => {
    const file = e.target.files[0];
    selectedImage.value = file;
    showCropper.value = true;

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    imageSource.value.onload = () => {
        cropper = new Cropper(imageSource.value, {
            aspectRatio: 1,
            viewMode: 1
        });
    };

    imageSource.value.src = URL.createObjectURL(file);
};


// For showing the croppedImage to the user before creating the course
let croppedImage = ref(null);

const croppedImageUrl = computed(() => {
    return croppedImage.value ? URL.createObjectURL(croppedImage.value) : '';
});


// CropImage function for cropping the image and convert it to jpeg and set the quality to 70% and finally return it as a blob (then close the cropper down and set the show value to false)
const cropImage = async () => {
    const croppedCanvas = cropper.getCroppedCanvas();
    const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.7);
    const response = await fetch(dataUrl);
    croppedImage.value = await response.blob();

    newCourse.value.image = croppedImage.value;
    showCropper.value = false;
    cropper.destroy();
    cropper = null;
};

// If pressing cancel then cancel the CropImage and set the show value to false
const cancelCrop = () => {
    showCropper.value = false;
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
};

// Handle the course creation and sends the request the the API call (courseApi.js)
const createCourse = async (catalogID) => {
    newCourse.value.tags = tagsInput.value.split(',').map(tag => tag.trim());

    const formData = new FormData();
    formData.append('image', newCourse.value.image, 'course_image.jpg');
    formData.append('title', newCourse.value.title);
    formData.append('description', newCourse.value.description);
    formData.append('private', newCourse.value.private);
    formData.append('tags', JSON.stringify(newCourse.value.tags));

    try {
        await api.createCourse(catalogID, formData);
        return true;
    } catch (error) {
        console.error('Error creating course:', error);
        return false;
    }
};



// Export the functions and variabels for use in courseCreateComponent.vue
export {
    createCourse,
    tagsInput,
    newCourse,
    onFileChange,
    showCropper,
    imageSource,
    selectedImageUrl,
    croppedImageUrl,
    cropImage, 
    cancelCrop, 
};