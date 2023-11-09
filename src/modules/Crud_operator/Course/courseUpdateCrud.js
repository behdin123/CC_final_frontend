  import { ref, computed } from 'vue';
  import api from '../../../api/courseApi.js';

  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';

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
  
  let selectedImage = ref(null);
  let showCropper = ref(false);
  let imageSource = ref(null);
  let cropper = null;

const selectedImageUrl = computed(() => {
  return selectedImage.value ? URL.createObjectURL(selectedImage.value) : '';
});

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



// For showing the croppedImage to the user before updating the course
let croppedImage = ref(null);

const croppedImageUrl = computed(() => {
    return croppedImage.value ? URL.createObjectURL(croppedImage.value) : '';
});


// Used when cropping the image and then sends the updatedCourse.value.image to handleUpdateCourse
const cropImage = async () => {
  const croppedCanvas = cropper.getCroppedCanvas();
  const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.7);
  const response = await fetch(dataUrl);
  croppedImage.value = await response.blob();

  updatedCourse.value.image = croppedImage.value;

  showCropper.value = false;
  cropper.destroy();
  cropper = null;
};


// When closing the update popup or finishing it, hte croppedImage.value is set to null so it dosent exist until the next image is choosed for opdate 
const resetCroppedImage = () => {
  croppedImage.value = null;
};

// If pressing the cancel button for while cropping image, the cropper is getting closed
const cancelCrop = () => {
  showCropper.value = false;
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
};



// If pressing update button, then the updated values is send (api call) to (courseApi.js)
const handleUpdateCourse = async () => {
  try {
    updatedCourse.value.tags = tagsInput.value.split(',').map((tag) => tag.trim());
    
    await api.updateCourse(updatedCourse.value._id, updatedCourse.value);

    // Hvis der er et beskåret billede, send det til backenden
    if (updatedCourse.value.image) {
      const formData = new FormData();
      formData.append('image', updatedCourse.value.image, 'course_image.jpg');
      await api.updateCourseImage(updatedCourse.value._id, formData);
    }

    return true;
  } catch (error) {
    console.error('Error updating course:', error);
    return false;
  }
};

export {
  onFileChange,
  updatedCourse,
  tagsInput,
  showCropper,
  imageSource,
  selectedImageUrl,
  croppedImageUrl,
  cropImage,
  resetCroppedImage,
  cancelCrop,
  handleUpdateCourse,
};