<template>
  <main>
    <div class="main-container" :class="{ 'main-container-dark': darkMode }">
      <div class="Mode-change back-to-course">
        <button @click="goBack">
          <img src="@/assets/toolbar/arrowBack.png" alt="" /> Back to Course
        </button>
        <button @click="toggleMode">
          {{ mode === "preview" ? "Edit" : "Preview" }} Mode
        </button>
      </div>

      <div class="main-div">
        <!-- Preview mode -->
        <div v-if="mode === 'preview'" ref="slideEditContainer" class="Slide-edit-container" :class="{ 'preview-mode': mode === 'preview' }">
          <section>
            <div class="slide-banner">
              <img v-if="!slide.banner && !slide.video" src="@/assets/placeholder-banner.png"/>
              <img v-if="slide.banner" :src="slide.banner" @error="bannerError"/>
            </div>
            <div class="slide-main-content">
              <div class="slide-title-text-box">
                <h2>{{ slide.title }}</h2>
                <p v-if="slide.text" class="slide-text-content" v-html="slide.text"> </p>
              </div>

              <div v-if="!isImageDeleted" ref="previewImageRef" class="image-container-edit">
                <div class="slide-image">
                  <img v-if="!slide.image && !slide.video && !isImageDeleted" src="@/assets/Image_placeholder.jpg"/>
                  <img v-if="slide.image" :src="slide.image" @error="imageError"/>
                </div>
              </div>

              <div v-if="isVideoAdded" ref="previewImageRef" class="video-container">
                <div class="slide-video">
                  <img v-if="!slide.video && isVideoAdded" src="@/assets/videoPlaceholder.png"/>
                  <video v-if="slide.video" controls="controls">
                    <source :src="slide.video" type="video/mp4" />
                    <img src="@/assets/videoPlaceholder.png" title="Your browser does not support the <video> tag"/>
                  </video>
                </div>
              </div>
            </div>

            <div class="slide-footer">
              <img v-if="!slide.footer" src="@/assets/placeholder-banner.png" />
              <img v-if="slide.footer" :src="slide.footer" @error="bannerError"/>
            </div>
          </section>
          <div class="progress-bar-div">
            <div>
              <button @click="goToPreviousSlide">Previous</button>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressBarWidth + '%' }"></div>
            </div>
            <div>
              <button @click="goToNextSlide">Next</button>
            </div>
          </div>
        </div>

        <!-- Edit mode -->
        <div v-if="mode === 'edit'" class="Slide-edit-container" :class="{ 'edit-mode': mode === 'edit' }">
          <section>
            <div class="slide-banner editable-field">
              <img v-if="!slide.banner && !selectedBannerUrl" src="@/assets/placeholder-banner.png"/>
              <img v-if="slide.banner && !selectedBannerUrl" :src="slide.banner" @error="bannerError"/>
              <img v-if="selectedBannerUrl" :src="selectedBannerUrl" alt="Slide Image" @error="bannerError"/>

              <div class="overlay">
                <input ref="bannerInput" class="input uploadBtn" type="file" accept="image/*" @change="
                    (event) => onFileChange(event.target.files[0], 'banner')
                  "
                />
                <div class="text newImage" @click="BannerFileUpload">
                  Upload new Banner
                </div>
              </div>
            </div>

            <div class="slide-main-content">
              <div class="slide-title-text-box">

                <div class="slide-title-editor">
                  <div class="hover-box" :class="{'hover-box-title-visible': isHoverBoxTitleVisible,}">
                    <div class="flex tool-bar-dev">
                      <b>font size</b>
                      <div class="flex toolbar-image font-size-width">
                        <img class="bigger" src="@/assets/toolbar/bigger.png" alt="" @click="handleIncreaseFontSize"/>
                        <img class="smaller" src="@/assets/toolbar/smaller.png" alt="" @click="handleDecreaseFontSize"/>
                      </div>
                    </div>

                    <!-- <div class="separator"></div> -->
                    <div class="flex tool-bar-dev">
                      <b>font style</b>
                      <div class="flex toolbar-image">
                        <img class="bold" src="@/assets/toolbar/bold.png" alt="" @click="handleBoldText"/>
                        <img class="italic" src="@/assets/toolbar/italic.png" alt="" @click="handleItalicText"/>
                        <img class="underline" src="@/assets/toolbar/underline.png" alt="" @click="handleUnderlineText"/>
                        <img class="bullet" src="@/assets/toolbar/bullet.png" alt=""/>
                        <img class="plain" src="@/assets/toolbar/plain.png" alt="" @click="handlePlainText"/>
                      </div>
                    </div>
                  </div>
                  <input v-model="editableSlide.title" type="text" placeholder="Enter Slide Title" @focus="handleFocusTitle" @blur="handleUnFocusTitle"/>
                </div>

                <div class="slide-text-editor">
                  <div class="hover-box" :class="{ 'hover-box-text-visible': isHoverBoxTextVisible }">

                  <div class="flex tool-bar-dev">
                      <b>font size</b>
                      <div class="flex toolbar-image font-size-width">
                        <img class="bigger" src="@/assets/toolbar/bigger.png" alt="" @click="handleIncreaseFontSize"/>
                        <img class="smaller" src="@/assets/toolbar/smaller.png" alt="" @click="handleDecreaseFontSize"/>
                      </div>
                    </div> 
                    <!-- <div class="separator"></div> -->
                   <div class="flex tool-bar-dev">
                      <b>font style</b>
                      <div class="flex toolbar-image">
                        <img class="bold" src="@/assets/toolbar/bold.png" alt="" @click="handleBoldText"/>
                        <img class="italic" src="@/assets/toolbar/italic.png" alt="" @click="handleItalicText"/>
                        <img class="underline" src="@/assets/toolbar/underline.png" alt="" @click="handleUnderlineText"/>
                        <img class="bullet" src="@/assets/toolbar/bullet.png" alt=""/>
                        <img class="plain" src="@/assets/toolbar/plain.png" alt="" @click="handlePlainText"/>
                      </div>
                    </div> 

                  </div>
                  <!-- Editable text area - slide.text -->
                  <div ref="textAreaRef" contenteditable="true" class="editable-content" placeholder="Enter Slide Content" @input="debounceUpdateContent" @focus="handleFocusText" @blur="handleUnFocusText"></div>
                </div>

              </div>

              <!-- Slide Image - Edit mode -->
              <div v-if="!isImageDeleted" ref="slideImageRef" class="image-container-edit">
                <div class="hover-box image-hover-box" :class="{ 'hover-box-image-visible': isHoverBoxImageVisible }">
                  <div class="flex crop-div">
                    <img class="crop" src="@/assets/toolbar/cropper.png" alt="" @click="initializeCropper"/>
                    <div v-show="showCropper" class="separator"> </div>
                    <img v-show="showCropper" src="@/assets/toolbar/oneToOneV1.png" alt="" @click="setOneToOneAspectRatio"/>
                    <img v-show="showCropper" src="@/assets/toolbar/sixtenTonineV1.png" alt="" @click="setSixteenToNineAspectRatio"/>
                    <img v-show="showCropper" src="@/assets/toolbar/nineToninesixtenV1.png" alt="" @click="setNineTonineSixtenAspectRatio"/>
                  </div>

                  <img class="trash" src="@/assets/toolbar/trash.png" alt="" @click="deleteImage"/>
                </div>
                <div class="slide-image editable-field" @click="handleFocusImage">
                  <img v-if="!slide.image && !selectedImageUrl" src="@/assets/Image_placeholder.jpg"/>
                  <img v-if="slide.image && !selectedImageUrl" :src="slide.image" @error="imageError"/>
                  <img v-if="selectedImageUrl" ref="cropperImage" :src="selectedImageUrl" alt="Slide Image" @error="imageError" />

                  <div class="overlay">
                    <input ref="imageInput" class="input uploadBtn" type="file" accept="image/*" @change="(event) => onFileChange(event.target.files[0], 'image')"/>
                    <div class="text newImage" @click="ImageFileUpload">
                      Upload new Image
                    </div>
                  </div>
                </div>

                <!-- Crop option for Slide.Image -->
                <div v-show="showCropper" class="crop-container">
                  <div class="crop-btn-div">
                    <button class="button Update-button" @click="applyCrop">
                      Crop
                    </button>
                    <button class="button" @click="cancelCrop">Cancel</button>
                  </div>
                </div>
              </div>

              <!-- Slide Video - Edit mode -->
              <div v-if="isVideoAdded" class="video-container">
                <div class="hover-box justify-content-end" :class="{ 'hover-box-image-visible': isHoverBoxImageVisible }">
                  <img class="trash" src="@/assets/toolbar/trash.png" alt="" @click="deleteVideo"/>
                </div>

                <div class="slide-video editable-field" @click="handleFocusImage">
                  <img v-if="!slide.video && !selectedVideoUrl" src="@/assets/videoPlaceholder.png"/>

                  <video v-if="slide.video && !selectedVideoUrl" controls="controls">
                    <source :src="slide.video" type="video/mp4" />
                    <img src="@/assets/videoPlaceholder.png" title="Your browser does not support the <video> tag"/>
                  </video>

                  <video v-if="selectedVideoUrl" ref="videoPlayerRef" alt="Slide Image">
                    <source :src="selectedVideoUrl" type="video/mp4" />
                  </video>

                  <div class="overlay">
                    <input ref="videoInput" class="input uploadBtn" type="file" accept="video/*"
                      @change="(event) => onFileChange(event.target.files[0], 'video')"/>
                    <div class="text newImage" @click="VideoFileUpload">
                      Upload new Video
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide footer - Edit mode -->
            <div class="slide-footer editable-field">
              <img v-if="!slide.footer && !selectedFooterUrl" src="@/assets/placeholder-banner.png"/>
              <img v-if="slide.footer && !selectedFooterUrl" :src="slide.footer" @error="bannerError"/>
              <img v-if="selectedFooterUrl" :src="selectedFooterUrl" alt="Slide Image" @error="bannerError"/>

              <div class="overlay">
                <input ref="footerInput" class="input uploadBtn" type="file" accept="image/*" @change="(event) => onFileChange(event.target.files[0], 'footer')"/>
                <div class="text newImage" @click="FooterFileUpload">
                  Upload new Footer
                </div>
              </div>
            </div>
          </section>
        </div>

        

        <!-- Side toolbar - for adding media to slide -->
        <div ref="sideNavbarBox" class="side-navbar-box">
          <div class="side-navbar">
            <div class="course-title">
              <div class="slide-title-flex">
                <h2>
                 <b> Slide Name:</b>  <p> {{ slide.title }} </p>
                </h2>
              </div>
              <div class="explain">
                <h2 class="flex-no-align">
                  <b>Description:</b>
                  <p>{{ slide.description }}</p>
                </h2>
              </div>
            </div>

            <div class="separator-width"> </div>

            <h2 v-if="mode === 'edit'">Add items</h2>
            <div v-if="mode === 'edit'" class="add-items-container">
              <div class="addmedia" @click="addVideo">
                <img v-if="!darkMode" src="@/assets/toolbar/addVideo.png" />
                <img v-else src="@/assets/toolbar/addVideoWhite.png" />
              </div>
              <div class="addmedia" @click="addImage">
                <img v-if="!darkMode" src="@/assets/toolbar/addImage.png" />
                <img v-else src="@/assets/toolbar/addImageWhite.png" />
              </div>
            </div>

            <div v-if="mode === 'edit'" class="separator-width"> </div>

            <!-- Save & update slide values -->
            <div v-if="mode === 'edit'" class="save-button-box">
              <button @click="saveSlide">Save Changes</button>
            </div>

          </div>
        </div>
      </div>
    </div>
    
  </main>
</template>

<script setup>
import { defineProps, computed, onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  // CRUD operations
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
} from "../../modules/Crud_operator/slide/slideUpdateCrud";

import {
  fetchSlideById,
  slidesByCourse,
  fetchSlidesByCourse,
} from "../../modules/Crud_operator/slide/slideGetCrud";

import {
  // To show the toolbar when clicking inside the text area
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
} from "../../modules/Main_logic/toolbar.js";

import {
  // To show the toolbar when clicking inside the text area
  bannerError,
  imageError,
  VideoError,

  mode,
  editableSlide,
  toggleMode,
} from "../../modules/Main_logic/slideBoard.js";

import {
  increaseFontSize,
  decreaseFontSize,
  applyBold,
  applyItalic,
  applyUnderline,
  applyPlainText,
  removeEmptyElements,
} from "../../modules/Main_logic/slideBoardTextEdit";

import { debounce } from "lodash-es";
import "cropperjs/dist/cropper.css";



/*
 *
 * to go back to course overview from slideBoard *
 *
 */

const router = useRouter();
const route = useRoute();

// Navigation control to go back to course overview from the slide preview
const goBack = () => {
    router.push({ name: "CourseBoard", params: { id: courseId.value } });
};

/*
 *
 * Logic for chaging slide (next button and previous button) *
 *
 */

// Reactive references and values
const slideId = ref(route.params.id);
const slide = ref({});
const currentSlide = ref(0); // Represents the current slide number
const totalSlides = ref(0); // Total number of slides in the course
const courseId = ref(null); // ID of the current course

// Initialize the component with data for the selected slide
onMounted(async () => {
  courseId.value = route.params.courseId;
  const globalIndex = parseInt(route.params.globalIndex, 10);

  if (!isNaN(globalIndex) && globalIndex >= 1) {
    await fetchSlidesByCourse(courseId.value);
    totalSlides.value = slidesByCourse.value.length;
    currentSlide.value = globalIndex;
    await displayCurrentSlide();
    // Update isImageDeleted & isVideoAdded based on the new slide
    isImageDeleted.value = !slide.value.image;
    isVideoAdded.value = !!slide.value.video;
    
  } else {
    console.error("Ugyldig globalIndex modtaget");
  }
});


// Update progressBar based on the current slide compared to the totalSlides value
const progressBarWidth = computed(() => (currentSlide.value / totalSlides.value) * 100);

const goToNextSlide = () => {
  if (currentSlide.value < totalSlides.value) {
    currentSlide.value++;
    navigateToSlide();
  }
};

const goToPreviousSlide = () => {
  if (currentSlide.value > 1) {
    currentSlide.value--;
    navigateToSlide();
  }
};

const navigateToSlide = () => {
  const globalIndex = currentSlide.value - 1;
  const slideId = getSlideIdByIndex(globalIndex);
  if (!slideId) {
    console.error("Slide ID ikke fundet for index:", globalIndex);
    return;
  }
  router.push({
    name: "SlideBoard",
    params: { id: slideId, courseId: courseId.value, globalIndex: globalIndex + 1 },
  });
};


// Funktion til at finde slide ID baseret på index.
const getSlideIdByIndex = (globalIndex) => {
  if (globalIndex >= 0 && globalIndex < totalSlides.value) {
    return slidesByCourse.value[globalIndex]._id;
  } else {
    console.error("Ugyldig globalIndex:", globalIndex);
    return null;
  }
};


// Display the current slide on the page with the correct values and parameters
const displayCurrentSlide = async () => {
  const currentSlideId = getSlideIdByIndex(currentSlide.value - 1);
  if (!currentSlideId) {
    console.error("Slide ID ikke fundet for index:", currentSlide.value);
    return;
  }

  try {
    slideId.value = currentSlideId;
    const fetchedSlide = await fetchSlideById(currentSlideId);
    slide.value = fetchedSlide;
    // ... Resten af din logik
  } catch (error) {
    console.error("Error fetching slide:", error);
  }
};


// Watches for route parameter changes to dynamically update the slide
watch(
  () => route.params,
  async (newParams) => {
      courseId.value = newParams.courseId;
      currentSlide.value = parseInt(newParams.globalIndex, 10);
      console.log("Slide globalIndex:", currentSlide.value);
      await displayCurrentSlide();

      // Update isImageDeleted & isVideoAdded based on the new slide
      isImageDeleted.value = !slide.value.image;
      isVideoAdded.value = !!slide.value.video;
  },
);




// Watch for changes in the slide data to update the editableSlide, when a new slide is loaded, the data is reflected in the edit mode
watch(
  () => slide.value,
  (newSlide) => {
    // Update editableSlide when slide data changes
    editableSlide.value = { ...newSlide };

    if (mode.value === "edit" && textAreaRef.value) {
      // Update the textAreaRef with the new content
      textAreaRef.value.innerHTML = newSlide.text;
    }
  },
  { deep: true }
);

// Watch for changes in the preview/edit mode to handle UI updates.
watch(mode, async (newMode) => {
  // Wait for DOM updates to complete
  await nextTick();

  if (newMode === "preview") {
    if (previewImageRef.value) {
      previewImageRef.value.style.width = `${slide.value.imageWidthPercent}%`;
      selectedImage.value = "";
      selectedVideo.value = "";
    }
    // Cancel text updates if changed to preview mode to prevent unintended text saving
    debounceUpdateContent.cancel();
    isHoverBoxTextVisible.value = false;
    isHoverBoxImageVisible.value = false;

  } else if (newMode === "edit") {
    if (slideImageRef.value) {
      slideImageRef.value.style.width = `${slide.value.imageWidthPercent}%`;
    }
    // Update textAreaRef if it is defined and there is text to display
    if (textAreaRef.value && editableSlide.value.text) {
      textAreaRef.value.innerHTML = editableSlide.value.text;
    }
  }
});



/*
 *
 * Logic for text edit toolbar *
 *
 */

// Logic for the slide.text edit and update the text style
const textAreaRef = ref(null);

// update text behavior
const debounceUpdateContent = debounce(updateEditableContent, 500);

const handleIncreaseFontSize = () => {
  increaseFontSize(updateEditableContent);
};

const handleDecreaseFontSize = () => {
  decreaseFontSize(updateEditableContent);
};

const handleBoldText = () => {
  applyBold(updateEditableContent);
};

const handleItalicText = () => {
  applyItalic(updateEditableContent);
};

const handleUnderlineText = () => {
  applyUnderline(updateEditableContent);
};

const handlePlainText = () => {
  applyPlainText(updateEditableContent);
};

// function to Update the content of the editable area
function updateEditableContent() {
  if (textAreaRef.value && textAreaRef.value) {
    editableSlide.value.text = textAreaRef.value.innerHTML;
  }
}

// Watch for changes and then remove empty spans and divs from the editable area
watch(() => editableSlide.value.text,
(newText) => {
    if (textAreaRef.value) {
      removeEmptyElements(textAreaRef.value);
    }
  },
  { deep: true }
);



/*
 *
 * Logic for image, banner and footer upload -  applyDynamicWidth - saveSlide after edit*
 *
 */
const bannerInput = ref(null);
const imageInput = ref(null);
const footerInput = ref(null);
const videoInput = ref(null);

const BannerFileUpload = () => {
  bannerInput.value.click();
};
const ImageFileUpload = () => {
  imageInput.value.click();
};
const FooterFileUpload = () => {
  footerInput.value.click();
};
const VideoFileUpload = () => {
  videoInput.value.click();
};

// variables for refrence to the slide-image image div in preview and edit mode
const slideImageRef = ref(null);
const previewImageRef = ref(null);

// calculate width from the new images aspect ratio - if the image is horizontal there is need for bigger width
const applyDynamicWidth = (imageElement, imageRef) => {
  if (!imageRef) {
    return;
  }

  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;
  const aspectRatio = width / height;

  const minWidthPercent = 10;
  const squareWidthPercent = 40;
  const maxWidthPercent = 45;

  let widthPercent;
  if (aspectRatio <= 1) {
  widthPercent =
      minWidthPercent + (squareWidthPercent - minWidthPercent) * aspectRatio;
  } else {
    widthPercent =
      squareWidthPercent + (maxWidthPercent - squareWidthPercent) * (aspectRatio - 1);
  }

  const clampedWidthPercent = Math.max( minWidthPercent, Math.min(widthPercent, maxWidthPercent));
  imageRef.style.width = `${clampedWidthPercent}%`;
  imageWidthPercent.value = clampedWidthPercent;
};

const loadImageAndApplyWidth = (imageUrl, imageRef) => {
  const imageElement = new Image();
  imageElement.onload = () => {
    applyDynamicWidth(imageElement, imageRef);
  };
  imageElement.src = imageUrl;
};

watch(selectedImageUrl, (newImageUrl) => {
  if (newImageUrl && slideImageRef.value) {
    loadImageAndApplyWidth(newImageUrl, slideImageRef.value);
  }
});

watch(() => slide.value.image,
  (newImage) => {
    if (newImage && previewImageRef.value) {
      loadImageAndApplyWidth(newImage, previewImageRef.value);
    }
  }
);


const videoPlayerRef = ref(null);
watch(selectedVideoUrl, (newVideoUrl) => {
  if (newVideoUrl) {
    console.log("Ny video URL detekteret:", newVideoUrl);
    if (videoPlayerRef.value) {
      videoPlayerRef.value.src = newVideoUrl;
    }
  }
});

// function to save and update the edits made in edit mode
const saveSlide = async () => {
  try {
    updatedSlide.value._id = slideId.value;
    updatedSlide.value.title = editableSlide.value.title;
    updatedSlide.value.text = editableSlide.value.text;

    // Update slide
    await handleUpdateSlide();

    // Reload slide data
    slide.value = await fetchSlideById(slideId.value);

    // Change back to preview mode
    mode.value = "preview";

    // nextTick, wait for DOM-updates to finish
    await nextTick();

    // If the image is not deleted, then set image container width (imageWidthPercent)
    if (!isImageDeleted.value && previewImageRef.value) {
      previewImageRef.value.style.width = `${imageWidthPercent.value}%`;
    }
  } catch (error) {
    console.error("Error saving slide:", error);
  }
};

const slideEditContainer = ref(null);
const sideNavbarBox = ref(null);

const updateSideNavbarHeight = () => {
  if (slideEditContainer.value && sideNavbarBox.value) {
    sideNavbarBox.value.style.height = `${slideEditContainer.value.offsetHeight}px`;
  }
};

onMounted(() => {
  setTimeout(updateSideNavbarHeight, 500); // Wait 500 milliseconds - to make sure the elements is rendered
  window.addEventListener("resize", updateSideNavbarHeight);
});

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function,
});

</script>



<style lang="scss" scoped>
@import "@/assets/global.scss";

.flex {
  display: flex;
  align-items: center;
}

.flex-no-align{
  display: flex;
  flex-direction: column;
}

.slide-title-flex h2{
  display: flex;
  align-items: flex-start;
}

.slide-title-flex h2 p{
  margin: 0;
  margin-left: 5px;
}

.flex-no-align p{
  margin: 0 0 5px 0;
}


.flex p {
  margin: 0 5px 0 0;
}

header {
  display: none !important;
}

main {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  min-height: 100vh;
  background-color: var(--main-background);
}

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
}

.Mode-change {
  position: absolute;
  z-index: 10;
  top: 30px;
  left: 20px;
}

.back-to-course img {
  width: 17px;
  height: auto;
  margin-right: 15px;
}

.main-div {
  position: relative;
  width: 100%;
  height: 94vh;
  color: #000;
  padding: 0px 30px 40px 30px;
  box-sizing: border-box;
}

.main-div .line {
  position: absolute !important;
  top: 240px;
  left: -5px;
  height: 0.5px;
  width: 94.5%;
}

.course-title {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 20px;
}

.course-title p{
  font-weight: lighter;
}

.course-title h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 20px;
}

.explain {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.explain b {
  margin-bottom: 15px;
}

.Slide-edit-container {
  padding: 30px 20px 30px 20px;
  width: 65vw;
  max-height: 95%;
  min-height: 80%;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  margin: 0px auto 0px auto;
  overflow: hidden;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.preview-mode {
  background-color: #fff;
  border: 1px solid #ddd;
}

.edit-mode {
  background-color: #fff;
}

.slide-main-content {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 50vh;
  max-height: 50vh;
  overflow: hidden;
}

section h2 {
  font-size: 36px;
  font-weight: bold;
  margin-top: 0;
}

section p {
  font-size: 18px;
  max-height: 80%;
  overflow: hidden;
}

section {
  display: flex !important;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  width: 100%;
}

.slide-info-box {
  display: flex !important;
  flex-direction: column;
  justify-content: flex-start;
}

.slide-title-text-box {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.slide-title-text-box input,
.editable-content {
  background: none;
  border: none;
  font-family: "Open Sans", sans-serif;
  border: 1.5px dashed var(--main-button);
  outline: none;
  color: #000;
}

.slide-title-text-box input:focus-visible,
.editable-content:focus-visible {
  border: 2px solid var(--main-button);
}

.slide-title-text-box input {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.slide-title-text-box .editable-content {
  font-size: 18px;
  overflow: hidden;
  box-sizing: border-box;
}

.editable-content:empty:before {
  content: attr(placeholder);
  color: grey;
}

.save-button-box {
  margin-top: 50px;
}

.slide-image {
  height: auto;
  position: relative;
  align-items: flex-start !important;
}

.slide-image img {
  width: 100%;
  height: auto;
}

.slide-video {
  width: 100%;
  height: auto;
  position: relative;
  align-items: flex-start !important;
  box-sizing: border-box;
}

.slide-video video,
img {
  width: 100%;
  height: auto;
}

.image-container-edit {
  position: relative;
  width: 40%;
}

.video-container {
  position: relative;
  width: 45%;
}

.video-container:hover .hover-box {
  height: 40px !important;
}

.image-container-edit:hover .hover-box {
  height: 40px !important;
}

button {
  background-color: var(--main-button);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 12px 30px;
  transition: background-color 0.1s ease-in-out;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.568);
  margin-bottom: 10px;
}

.editable-field {
  border: 2px dashed var(--main-button);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.editable-field:hover .overlay {
  opacity: 1;
}

.slide-banner,
.slide-footer {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  height: 15%;
}

.slide-banner {
  margin-bottom: 15px;
}

.slide-banner img {
  width: 100%;
  height: auto;
}

.slide-footer {
  margin: 20px 0 20px 0;
}

.slide-footer img {
  width: 100%;
  height: auto;
}

.hover-box {
  width: 100%;
  height: 0;
  background: #474747;
  color: #ffffff;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  padding-left: 10px;
}

.hover-box-title-visible {
  height: 40px !important;
}

.hover-box-text-visible {
  height: 40px !important;
}

.hover-box-image-visible {
  height: 40px !important;
}

.hover-box img {
  width: auto;
  height: 25px;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.hover-box img:hover {
  opacity: 0.6;
}

.image-hover-box{
  justify-content: space-between;
  padding: 0 15px;
}

.tool-bar-dev{
  width: 44%;
}

.tool-bar-dev b{
  font-size: 14px;
  font-weight: bold;
  padding-right: 10px;
}

.toolbar-image img{
  padding: 0 4%;
}

.font-size-width{
  width: 50%;
}

.slide-text-editor .separator {
  margin: 3% 0px;
} 

.crop-div {
  width: 60%;
  justify-content: space-between;
}

button {
  padding: 12px 20px;
}

.progress-bar-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
}

.progress-bar {
  flex-grow: 1;
  height: 20px;
  background-color: #eee;
  margin: 0 15px;
}

.progress {
  height: 100%;
  background-color: #1f7698;
  width: 0%; /* Initial width */
}

.separator {
  height: 20px;
  border-left: 2px solid #909090;
  margin: 10px 0;
}

.separator-width {
  height: 2px;
  width: 100%;
  background: #909090;
  margin: 20px 0;
}

.crop-container {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.crop-btn-div {
  width: 100%;
  margin: 0 !important;
}

.side-navbar-box {
  color: var(--white-black-color);
  position: absolute;
  width: 14%;
  max-height: 90%;
  top: 0;
  right: 1%;
  display: flex;
  justify-content: center;
}

.side-navbar {
  width: 100%;
  background-color: var(--second-background);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 0px 10px 30px 10px;
  box-sizing: border-box;
}

.side-navbar h2 {
  font-size: 16px;
  margin-bottom: 25px;
}

.add-items-container {
  display: flex;
  justify-content: space-between;
}

.addmedia {
  width: 80px;
  height: auto;
}

.addmedia img {
  width: 100%;
  height: auto;
  cursor: pointer;
}

.addmedia img:hover {
  opacity: 0.5;
}

.justify-content-end {
  justify-content: flex-end;
}

@media screen and (max-width: 2000px) {
  section h2 {
    font-size: 30px;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 0;
  }

  .Slide-edit-container {
    overflow: hidden;
    transition: background-color 0.3s ease;
  }

  .slide-title-text-box input {
    font-size: 30px;
  }

  .course-title h2 {
    font-size: 16px;
  }
}
</style>
