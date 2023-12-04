import { ref } from 'vue';

import {
    // CRUD operations
    selectedImage,
  } from "../../modules/Crud_operator/slide/slideUpdateCrud";
import Cropper from "cropperjs";

/*
 *
 * Show toolbar over text area and image when they are focused *
 *
 */
const isHoverBoxTitleVisible = ref(false);
const isHoverBoxTextVisible = ref(false);
const isHoverBoxImageVisible = ref(false);

function handleFocusText() {
    isHoverBoxTextVisible.value = true;
}

function handleUnFocusText() {
    isHoverBoxTextVisible.value = false;
}

function handleFocusTitle() {
    isHoverBoxTitleVisible.value = true;
}

function handleUnFocusTitle() {
    isHoverBoxTitleVisible.value = false;
}

function handleFocusImage() {
    isHoverBoxImageVisible.value = true;
}


/*
 *
 * Logic for cropping image *
 *
 */
const cropperImage = ref(null);
let cropper = null;
let showCropper = ref(false);
let croppedImage = ref(null);

const setOneToOneAspectRatio = () => {
  if (cropper) {
    cropper.setAspectRatio(1); // aspect ratio 1:1
  }
};

const setSixteenToNineAspectRatio = () => {
  if (cropper) {
    cropper.setAspectRatio(16 / 9); // aspect ratio 16:9
  }
};

const setNineTonineSixtenAspectRatio = () => {
  if (cropper) {
    cropper.setAspectRatio(9 / 16); // aspect ratio 9:16
  }
};

const initializeCropper = () => {
  if (cropperImage.value && !cropper) {
    cropper = new Cropper(cropperImage.value, {
      aspectRatio: NaN, // Tillader brugeren at justere aspect ratio
      crop(event) {
        console.log(event.detail.width);
        console.log(event.detail.height);
      },
    });

    showCropper.value = true;
  }
};

const applyCrop = async () => {
  if (cropper) {
    const croppedCanvas = cropper.getCroppedCanvas();
    const dataUrl = croppedCanvas.toDataURL("image/jpeg", 0.4); // Konverter til data URL

    const response = await fetch(dataUrl);
    croppedImage.value = await response.blob(); // Konverter til blob
    selectedImage.value = croppedImage.value; // Opdater selectedImage med det beskårne billede

    cropper.destroy();
    cropper = null;
    showCropper.value = false; // Skjul Crop og Cancel knapper
  }
};

const cancelCrop = () => {
  showCropper.value = false;
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
};

export {
    // to show the toolbar when clicking inside the text area
    isHoverBoxTitleVisible,
    isHoverBoxTextVisible,
    isHoverBoxImageVisible,
    handleFocusText,
    handleUnFocusText,
    handleFocusTitle,
    handleUnFocusTitle,
    handleFocusImage,

    // Handle cropping of the chosen image
    cropperImage,
    showCropper,
    setOneToOneAspectRatio,
    setSixteenToNineAspectRatio,
    setNineTonineSixtenAspectRatio,
    initializeCropper,
    applyCrop,
    cancelCrop,
  };
  