import { ref, computed } from 'vue';
import api from '../../../api/slideApi.js'; 





const { updateSlide, updateSlideImage, updateSlideBanner, updateSlideFooter, updateSlideVideo } = api; 

const updatedSlide = ref({
  _id: '',
  title: '',
  description: '',
});


const setUpdatedSlide = (newSlideData) => {
  updatedSlide.value = { ...newSlideData };
};

const selectedImage = ref(null);
const selectedBanner = ref(null);
const selectedFooter = ref(null);
const selectedVideo = ref(null);


const imageSource = ref(new Image());
const bannerSource = ref(new Image());
const footerSource = ref(new Image());

const imageWidthPercent = ref(null)




const selectedImageUrl = computed(() => {
  return selectedImage.value ? URL.createObjectURL(selectedImage.value) : '';
});

const selectedBannerUrl = computed(() => {
  return selectedBanner.value ? URL.createObjectURL(selectedBanner.value) : '';
});

const selectedFooterUrl = computed(() => {
  return selectedFooter.value ? URL.createObjectURL(selectedFooter.value) : '';
});

const selectedVideoUrl = computed(() => {
  return selectedVideo.value ? URL.createObjectURL(selectedVideo.value) : '';
});


const onFileChange = (file, type) => {
  switch (type) {
    case 'image':
      selectedImage.value = file;
      imageSource.value.src = URL.createObjectURL(file);
      break;
    case 'banner':
      selectedBanner.value = file;
      bannerSource.value.src = URL.createObjectURL(file);
      break;
    case 'footer':
      selectedFooter.value = file;
      footerSource.value.src = URL.createObjectURL(file);
      break;
    case 'video':
      selectedVideo.value = file;
      console.log('Selected video file:', selectedVideo.value);
  }
};



const isImageDeleted = ref(false);
const isVideoAdded = ref(true);


const deleteImage = () => {
  selectedImage.value = null; // remove the chosen image
  imageSource.value.src = ''; // Remove imageSource
  // Update slide.image to empty string so the image is "deleted"
  updatedSlide.value.image = ''; 
  isImageDeleted.value = true;
};

const addImage = () => {
  isVideoAdded.value = false;
  isImageDeleted.value = false;
};




const deleteVideo = () => {
  selectedVideo.value = null; // Remove the chosen video
  // Update slide.video to an empty string to indicate the video is "deleted"
  updatedSlide.value.video = '';
  isVideoAdded.value = false;
};

const addVideo = () => {
  isVideoAdded.value = true;
  isImageDeleted.value = true;
};



const handleUpdateSlide = async () => {
  console.log('Updated Slide ID:', updatedSlide.value._id);
  try {
    // Update slide text data
    await updateSlide(updatedSlide.value._id, updatedSlide.value);

    // Update slide image, if their is a new image
    if (selectedImage.value) {
      const imageFormData = new FormData();
      imageFormData.append('image', selectedImage.value, "cropped-image.jpg");
      imageFormData.append('imageWidthPercent', imageWidthPercent.value.toString());

      await updateSlideImage(updatedSlide.value._id, imageFormData);
    } else if (isImageDeleted.value) {
      // When the image is marked as deleted
      await updateSlideImage(updatedSlide.value._id, null);
    }

    // Update slide banner
    if (selectedBanner.value) {
      const bannerFormData = new FormData();
      bannerFormData.append('banner', selectedBanner.value, selectedBanner.value.name);
      await updateSlideBanner(updatedSlide.value._id, bannerFormData);
    }

    // Update slide footer
    if (selectedFooter.value) {
      const footerFormData = new FormData();
      footerFormData.append('footer', selectedFooter.value, selectedFooter.value.name);
      await updateSlideFooter(updatedSlide.value._id, footerFormData);
    }

    // Update slide video
    if (selectedVideo.value) {
      const videoFormData = new FormData();
      videoFormData.append('video', selectedVideo.value, selectedVideo.value.name);
      await updateSlideVideo(updatedSlide.value._id, videoFormData);
    } else {
      // When the video is deleted
      await updateSlideVideo(updatedSlide.value._id, null);
    }

    return true;

  } catch (error) {
    console.error('Error updating slide:', error);
    return false;
  }
};

export {
  setUpdatedSlide,
  onFileChange,
  updatedSlide,
  selectedImage,
  selectedImageUrl,
  selectedBannerUrl,
  selectedFooterUrl,
  selectedVideo,
  selectedVideoUrl,


  isImageDeleted,
  deleteImage,
  addImage,
  isVideoAdded,
  deleteVideo,
  addVideo,

  handleUpdateSlide,
  imageWidthPercent,
};