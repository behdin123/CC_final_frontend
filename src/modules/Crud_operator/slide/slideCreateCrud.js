import { ref, toRaw } from 'vue';
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
    const slideData = toRaw(newSlide.value); // Konverter Vue proxy til rå data
    slideData.image = imageFile.value;
    slideData.lesson = lessonId;
    try {
        const createdSlide = await api.createSlide(lessonId, slideData);
        /* console.log("Slide oprettet med succes:", createdSlide); */
        return createdSlide; // Return success status
    } catch (error) {
        console.error('Error creating slide:', error);
        // Hvis der er en fejlrespons fra API, log det
        if (error.response) {
            console.error('API response error:', error.response);
        }
        return false; // Return failure status
    }
};

const UpdateAllSlideOrder = async (slides) => {
    const slideOrders = slides.map(slide => ({ slideId: slide._id, newOrder: slide.globalIndex }));
    console.log("Bulk update before slide orders:", slideOrders);
    try {
        await api.UpdateAllSlideOrder(slideOrders);
        console.log("All slides order updated successfully");
    } catch (error) {
        console.error('Error in bulk updating slide order:', error);
    }
};

const uploadPdf = async (pdfFile, lessonId) => {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('lessonId', lessonId);

    console.log("Sending upload request with lessonId:", lessonId);
    try {
      const response = await api.uploadPdf(formData);
      console.log("Response received:", response);
      return response;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      return false;
    }
};
  



// Export the functions and variables for use in YourVueComponent.vue
export {
    createSlide,
    newSlide,
    onFileChange,
    UpdateAllSlideOrder,
    uploadPdf,
};