import { ref, computed } from 'vue';
import api from '../../../api/slideApi.js'; 





const { updateSlide, updateSlideImage, updateSlideBanner, updateSlideFooter, updateSlideVideo } = api; 

const updatedSlide = ref({
  _id: '',
  title: '',
  description: '',
});

const selectedImage = ref(null);
const selectedBanner = ref(null);
const selectedFooter = ref(null);

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
  }
};





const handleUpdateSlide = async () => {
  try {
    // Opdater slide tekstbaserede data
    await updateSlide(updatedSlide.value._id, updatedSlide.value);

    // Opdater slide image, hvis der er et nyt billede
    if (selectedImage.value) {
      const imageFormData = new FormData();
      imageFormData.append('image', selectedImage.value, "cropped-image.jpg");
      imageFormData.append('imageWidthPercent', imageWidthPercent.value.toString());

      await updateSlideImage(updatedSlide.value._id, imageFormData);
    }

    // Opdater slide banner, hvis der er et nyt banner
    if (selectedBanner.value) {
      const bannerFormData = new FormData();
      bannerFormData.append('banner', selectedBanner.value, selectedBanner.value.name);
      await updateSlideBanner(updatedSlide.value._id, bannerFormData);
    }

    // Opdater slide footer, hvis der er en ny footer
    if (selectedFooter.value) {
      const footerFormData = new FormData();
      footerFormData.append('footer', selectedFooter.value, selectedFooter.value.name);
      await updateSlideFooter(updatedSlide.value._id, footerFormData);
    }


    return true;
  } catch (error) {
    console.error('Error updating slide:', error);
    return false;
  }
};

export {
  onFileChange,
  updatedSlide,
  selectedImage,
  selectedImageUrl,
  selectedBannerUrl,
  selectedFooterUrl,
  handleUpdateSlide,
  imageWidthPercent,
};