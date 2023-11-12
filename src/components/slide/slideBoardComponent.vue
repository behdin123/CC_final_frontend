<template>
    <main>

        <div class="main-container" v-bind:class="{ 'main-container-dark': darkMode }">

            <div class="Mode-change back-to-course">
                <button @click="goBack"> <img src="@/assets/toolbar/arrowBack.png" alt=""> Back to Course</button>
                <button @click="toggleMode">{{ mode === 'preview' ? 'Edit' : 'Preview' }} Mode</button>
            </div>

            <div class="main-div">

                <!-- <div class="course-title">
                    <div>
                        <h2>Slide Name: <b> {{ slide.title }} </b></h2>
                        
                     </div>
                     <div class="explain">
                        <div class="flex"><p>Description:</p><b>{{ slide.description }}</b></div>
                    </div>
                </div> -->

                

                <!-- Preview mode -->
                <div class="Slide-edit-container" v-if="mode === 'preview'" :class="{ 'preview-mode': mode === 'preview' }">
                    <section>
                        <div class="slide-banner" v-if="slide.banner">
                            <img :src="slide.banner">
                        </div>

                        <div class="slide-main-content">
                            <div class="slide-title-text-box">
                                <h2>{{ slide.title }}</h2>
                                <p class="slide-text-content" v-html="slide.text" v-if="slide.text"></p>
                            </div>
                            <div class="image-container-edit" ref="previewImageRef">
                                <div class="slide-image" v-if="slide.image">
                                    <img :src="slide.image">
                                </div>
                            </div>
                        </div>
                        
                        <div class="slide-footer" v-if="slide.footer">
                            <img :src="slide.footer">
                        </div>
                    </section>
                    <div class="progress-bar-div">
                        <div>
                            <button @click="goToPreviousSlide"> Previous </button>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: progressBarWidth + '%' }"></div>
                        </div>
                        <div>
                            <button @click="goToNextSlide"> Next </button>
                        </div>
                    </div>
                </div>

                <!-- Edit mode -->
                <div class="Slide-edit-container" v-if="mode === 'edit'" :class="{ 'edit-mode': mode === 'edit' }">
                    <section>
                        <div class="slide-banner editable-field">
                            <img v-if="!slide.banner && !selectedBannerUrl" src="@/assets/placeholder-banner.png">
                            <img v-if="slide.banner && !selectedBannerUrl" :src="slide.banner">
                            <img v-if="selectedBannerUrl" :src="selectedBannerUrl" alt="Slide Image"/>

                            <div class="overlay">
                                <input class="input uploadBtn" type="file" @change="event => onFileChange(event.target.files[0], 'banner')" accept="image/*" ref="bannerInput">
                                <div class="text newImage" @click="BannerFileUpload">Upload new Banner</div>
                            </div>
                        </div>

                        <div class="slide-main-content">
                            <div class="slide-title-text-box">
                                <div class="slide-title-editor">
                                    <div class="hover-box" :class="{ 'hover-box-title-visible': isHoverBoxTitleVisible }">
                                        <img class="bigger" src="@/assets/toolbar/bigger.png" alt="">
                                        <img class="smaller" src="@/assets/toolbar/smaller.png" alt="">
                                        <img class="bold" src="@/assets/toolbar/bold.png" alt="">
                                        <img class="italic" src="@/assets/toolbar/italic.png" alt="">
                                        <img class="underline" src="@/assets/toolbar/underline.png" alt="">
                                        <img class="bullet" src="@/assets/toolbar/bullet.png" alt="">
                                    </div>
                                    <input type="text" v-model="editableSlide.title" placeholder="Enter Slide Title" />
                                </div>
                                <div class="slide-text-editor">
                                    <div class="hover-box" :class="{ 'hover-box-text-visible': isHoverBoxTextVisible }">
                                        <!-- <quillEditor theme="bubble" toolbar="esential" /> -->
                                        <img class="bigger" @click="increaseFontSize" src="@/assets/toolbar/bigger.png" alt="">
                                        <img class="smaller" @click="decreaseFontSize" src="@/assets/toolbar/smaller.png" alt="">
                                        <img class="bold" @click="applyBold" src="@/assets/toolbar/bold.png" alt="">
                                        <img class="italic" @click="applyItalic" src="@/assets/toolbar/italic.png" alt="">
                                        <img class="underline" @click="applyUnderline" src="@/assets/toolbar/underline.png" alt="">
                                        <img class="bullet" src="@/assets/toolbar/bullet.png" alt="">
                                        <img class="plain" @click="applyPlainText" src="@/assets/toolbar/plain.png" alt="">
                                    </div>
                                    <div contenteditable="true"  
                                    ref="textAreaRef"
                                    class="editable-content" 
                                    @input="debounceUpdateContent" 
                                    @focus="handleFocusText"
                                    placeholder="Enter Slide Content"></div>
                                </div>
                            </div>

                            <div class="image-container-edit" ref="slideImageRef">
                                <div class="hover-box" :class="{ 'hover-box-image-visible': isHoverBoxImageVisible }">
                                    <div class="flex crop-div">
                                        <img class="crop" @click="initializeCropper" src="@/assets/toolbar/cropper.png" alt="">
                                        <div v-show="showCropper" class="separator"></div>
                                        <img v-show="showCropper" @click="setOneToOneAspectRatio" src="@/assets/toolbar/oneToOneV1.png" alt="">
                                        <img v-show="showCropper" @click="setSixteenToNineAspectRatio" src="@/assets/toolbar/sixtenTonineV1.png" alt="">
                                        <img v-show="showCropper" @click="setNineTonineSixtenAspectRatio" src="@/assets/toolbar/nineToninesixtenV1.png" alt="">
                                    </div>

                                    <img class="trash" @click="deleteImage" src="@/assets/toolbar/trash.png" alt="">
                                </div>
                                <div class="slide-image editable-field" @click="handleFocusImage">
                                    
                                    <img v-if="!slide.image" src="@/assets/Image_placeholder.jpg">
                                    <img v-if="slide.image && !selectedImageUrl" :src="slide.image">
                                    <img v-if="selectedImageUrl" :src="selectedImageUrl" ref="cropperImage" alt="Slide Image"/>

                                    

                                    <div class="overlay">
                                        <input class="input uploadBtn" type="file" @change="event => onFileChange(event.target.files[0], 'image')" accept="image/*" ref="imageInput">
                                        <div class="text newImage" @click="ImageFileUpload">Upload new Image</div>
                                    </div>

                                    
                                </div>

                                <div class="crop-container" v-show="showCropper">
                                    <div class="crop-btn-div">
                                        <button class="button Update-button" @click="applyCrop">Crop</button>
                                        <button class="button" @click="cancelCrop">Cancel</button>
                                    </div> 
                                </div>

                            </div>
                        </div>

                            
                       
                        
                        <div class="slide-footer editable-field">
                            <img v-if="!slide.footer && !selectedFooterUrl" src="@/assets/placeholder-banner.png">
                            <img v-if="slide.footer && !selectedFooterUrl" :src="slide.footer">
                            <img v-if="selectedFooterUrl" :src="selectedFooterUrl" alt="Slide Image"/>

                            <div class="overlay">
                                <input class="input uploadBtn" type="file" @change="event => onFileChange(event.target.files[0], 'footer')" accept="image/*" ref="footerInput">
                                <div class="text newImage" @click="FooterFileUpload">Upload new Footer</div>
                            </div>
                        </div>
                    </section>
                    
                </div>

                <div v-if="mode === 'edit'" class="save-button-box">
                     <button @click="saveSlide">Save Changes</button>
                </div>
               
            </div>   
        </div>
    </main>
</template>

<script setup>
import { defineProps, computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  // CRUD operations
  onFileChange,
  updatedSlide,
  selectedImage,
  selectedImageUrl,
  selectedBannerUrl,
  selectedFooterUrl,
  handleUpdateSlide,
  imageWidthPercent,
} from '../../modules/Crud_operator/slide/slideUpdateCrud';
import {
    fetchSlideById,
    slidesByCourse,
    fetchSlidesByCourse,
} from '../../modules/Crud_operator/slide/slideGetCrud';
import {
 // To show the toolbar when clicking inside the text area
 isHoverBoxTitleVisible,
 isHoverBoxTextVisible,
 isHoverBoxImageVisible,
 handleFocusText,
 handleFocusTitle,
 handleFocusImage,
} from '../../modules/Main_logic/toolbar.js';
import { debounce } from 'lodash-es';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';


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
    cropper.setAspectRatio(1); // Sætter aspect ratio til 1:1
  }
};

const setSixteenToNineAspectRatio = () => {
  if (cropper) {
    cropper.setAspectRatio(16 / 9); // Sætter aspect ratio til 16:9
  }
};

const setNineTonineSixtenAspectRatio = () => {
  if (cropper) {
    cropper.setAspectRatio(9 / 16); // Sætter aspect ratio til 16:9
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
    const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.4); // Konverter til data URL

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



/*
*
* Logic for chaging slide (next button and previous button) *
*
*/

// Reactive references and values
const route = useRoute();
const router = useRouter();
const slideId = ref(route.params.id);
const slide = ref({});
const currentSlide = ref(1); // Represents the current slide number
const totalSlides = ref(0); // Total number of slides in the course
const courseId = ref(null); // ID of the current course


// Initialize the component with data for the selected slide
onMounted(async () => {
    courseId.value = route.params.courseId;
    const slideIndex = parseInt(route.params.slideIndex, 10);
    console.log("Received courseId:", courseId.value, "Received slideIndex:", slideIndex);
    try {
        const slides = await fetchSlidesByCourse(courseId.value); //gets all the slides for this course, to get the totalSlides value
        slidesByCourse.value = slides;
        totalSlides.value = slides.length;
        currentSlide.value = slideIndex + 1;
        await displayCurrentSlide();
        console.log("Total slides:", totalSlides.value, "Current slide:", currentSlide.value);
        console.log("progressBarWidth:", progressBarWidth.value);
    } catch (error) {
        console.error('Error fetching slides:', error);
    }
});

// Navigation control to go back to course overview from the slide preview
const goBack = () => {
    router.push({ name: 'CourseBoard', params: { id: courseId.value } }); 
};


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
    const slideIndex = currentSlide.value - 1;
    const slideId = getSlideIdByIndex(slideIndex); 
    router.push({ name: 'SlideBoard', params: { id: slideId, courseId: courseId.value, slideIndex: slideIndex } });
};

// Funktion til at finde slide ID baseret på index. 
const getSlideIdByIndex = (index) => {
    return slidesByCourse.value[index]._id;
};

// Display the current slide on the page with the correct values and parameters 
const displayCurrentSlide = async () => {
    try {
        const currentSlideId = getSlideIdByIndex(currentSlide.value - 1);
        slideId.value = currentSlideId;
        const fetchedSlide = await fetchSlideById(currentSlideId);
        slide.value = fetchedSlide; // Updates slide data with the fetchedSlide

        // Updates editableSlide and image width based on the new slide
        editableSlide.value = { ...fetchedSlide };
        if (mode.value === 'preview' && previewImageRef.value && fetchedSlide.imageWidthPercent) {
            previewImageRef.value.style.width = `${fetchedSlide.imageWidthPercent}%`;
        }

    } catch (error) {
        console.error('Error fetching slide:', error);
    }
};

// Watches for route parameter changes to dynamically update the slide
watch(() => route.params, async (newParams) => {
    courseId.value = newParams.courseId;
    const slideIndex = parseInt(newParams.slideIndex, 10);
    currentSlide.value = slideIndex + 1;
    await displayCurrentSlide();
}, { immediate: true });





// 2 Modes for this page - preview mode for showing the slide & edit mode
const mode = ref('preview');
const editableSlide = ref({});

const toggleMode = () => {
    mode.value = mode.value === 'preview' ? 'edit' : 'preview';
    if (mode.value === 'edit') {
        nextTick(() => {
            if (textAreaRef.value && editableSlide.value.text) {
                textAreaRef.value.innerHTML = editableSlide.value.text;
            }
        });
    }
};


// Watch for changes in the slide data to update the editableSlide, when a new slide is loaded, the data is reflected in the edit mode
watch(() => slide.value, (newSlide) => {
    // Update editableSlide when slide data changes
    editableSlide.value = { ...newSlide };

    if (mode.value === 'edit' && textAreaRef.value) {
        // Update the textAreaRef with the new content
        textAreaRef.value.innerHTML = newSlide.text;
    }
}, { deep: true });


// Watch for changes in the preview/edit mode to handle UI updates accordingly.
watch(mode, async (newMode) => {
  // Wait for DOM updates to complete
  await nextTick();

  if (newMode === 'preview') {
    if (previewImageRef.value) {
      previewImageRef.value.style.width = `${slide.value.imageWidthPercent}%`;
      selectedImage.value = '';
    }
    // Cancel text updates if changed to preview mode to prevent unintended text saving
    debounceUpdateContent.cancel();
    isHoverBoxTextVisible.value = false;
    isHoverBoxImageVisible.value = false;
  } else if (newMode === 'edit') {
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


// function to update the Font size of selected text
function applyStyleToSelection(action) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    range = trimRangeWhitespace(range);
    const selectedText = range.toString();
    if (!selectedText) return; // Do nothing if no text is selected

    let spanToStyle;

    // Check if the selected text is in a span
    let parentNode = range.commonAncestorContainer;
    if (parentNode.nodeType !== Node.ELEMENT_NODE) {
        parentNode = parentNode.parentNode;
    }

    if (parentNode.nodeName === 'SPAN' && range.toString() === parentNode.textContent) {
        // Use existing span if it only covers the selected area
        spanToStyle = parentNode;
    } else {
        // Or, create new span around the selected text
        spanToStyle = document.createElement('span');
        spanToStyle.textContent = selectedText;
        range.deleteContents();
        range.insertNode(spanToStyle);
    }

    // Calculate and apply the new font size
    const currentFontSize = parseInt(window.getComputedStyle(spanToStyle, null).fontSize);
    const newFontSize = action === 'increase' ? currentFontSize + 1 : Math.max(12, currentFontSize - 1);
    spanToStyle.style.fontSize = `${newFontSize}px`;

    // Update the selection
    const newRange = document.createRange();
    newRange.selectNodeContents(spanToStyle);
    selection.removeAllRanges();
    selection.addRange(newRange);

    updateEditableContent();
}

// click handlers
function increaseFontSize() {
    applyStyleToSelection('increase');
}

function decreaseFontSize() {
    applyStyleToSelection('decrease');
}

// function to update the text style (bold, italic, underline) of selected text
function applyStyle(styleType) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    range = trimRangeWhitespace(range);
    if (range.collapsed) return; // No text selected

    let styleProperty, styleValue;
    switch (styleType) {
        case 'bold':
            styleProperty = 'fontWeight';
            styleValue = 'bold';
            break;
        case 'italic':
            styleProperty = 'fontStyle';
            styleValue = 'italic';
            break;
        case 'underline':
            styleProperty = 'textDecoration';
            styleValue = 'underline';
            break;
        default:
            return; 
    }

    const selectedContent = range.extractContents();
    const spans = selectedContent.querySelectorAll('span');
    let isStyleApplied = false;

    spans.forEach(span => {
        if (span.style[styleProperty] === styleValue) {
            span.style[styleProperty] = '';
            if (!span.style.cssText.trim()) {
                unwrapElement(span);
            }
            isStyleApplied = true;
        }
    });

    if (!isStyleApplied) {
        const newSpan = document.createElement('span');
        newSpan.style[styleProperty] = styleValue;
        newSpan.appendChild(selectedContent);
        range.insertNode(newSpan);
    } else {
        range.insertNode(selectedContent);
    }

    // Update the the chosen text the keep the selected area selected
    selection.removeAllRanges();
    selection.addRange(range);

    updateEditableContent();
}

// click handlers
function applyBold() {
    applyStyle('bold');
}

function applyItalic() {
    applyStyle('italic');
}

function applyUnderline() {
    applyStyle('underline');
}

// function to remove any text style (bold, italic, underline) of selected text
function applyPlainText() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    range = trimRangeWhitespace(range);
    if (range.collapsed) return; // No text selected

    // Extracts the selected content
    const selectedContent = range.extractContents();

    // Find spans and replace them with their contents
    const spans = selectedContent.querySelectorAll('span');
    spans.forEach(span => unwrapElement(span));

    // Inserts the modified content back into the document
    range.insertNode(selectedContent);

    // Update the selection to focus on the changed area
    const newRange = document.createRange();
    newRange.selectNodeContents(range.commonAncestorContainer);
    selection.removeAllRanges();
    selection.addRange(newRange);

    updateEditableContent();
}

// function to make sure that the selected text is only text and now white space is selected
function trimRangeWhitespace(range) {
    let startContainer = range.startContainer;
    let endContainer = range.endContainer;
    let startOffset = range.startOffset;
    let endOffset = range.endOffset;

    // Trim start
    if (startContainer.nodeType === Node.TEXT_NODE) {
        while (startOffset < startContainer.textContent.length && startContainer.textContent[startOffset].match(/\s/)) {
            startOffset++;
        }
    }

    // Trim end
    if (endContainer.nodeType === Node.TEXT_NODE) {
        while (endOffset > 0 && endContainer.textContent[endOffset - 1].match(/\s/)) {
            endOffset--;
        }
    }

    // Update range
    const newRange = document.createRange();
    newRange.setStart(startContainer, startOffset);
    newRange.setEnd(endContainer, endOffset);
    return newRange;
}

// function to unwrap span and div elements in (inner.html)
function unwrapElement(el) {
    const parent = el.parentNode;
    while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
    parent.normalize(); // Merge text nodes
}

// function to remove empty span and div elements in (inner.html)
function removeEmptyElements(element) {
    const elements = element.querySelectorAll('span, div');
    elements.forEach(el => {
        // Checks if the element is a span or div with no direct text content
        if (!el.textContent.trim()) {
            unwrapElement(el);
        } else if (el.tagName === 'SPAN' && !el.style.cssText.trim()) {
            // Checks if all child elements in the selected area are spans with no text or style
            let allChildrenAreEmptySpans = Array.from(el.children).every(child => 
                child.tagName === 'SPAN' && !child.textContent.trim() && !child.style.cssText.trim()
            );

            if (allChildrenAreEmptySpans) {
                unwrapElement(el);
            }
        }
    });
}

// function to Update the content of the editable area
function updateEditableContent() {
    if (textAreaRef && textAreaRef.value) {
        editableSlide.value.text = textAreaRef.value.innerHTML;
    }
}

// Watch for changes and then remove empty spans and divs from the editable area
watch(() => editableSlide.value.text, (newText) => {
  if (textAreaRef.value) {
    removeEmptyElements(textAreaRef.value);
  }
}, { deep: true });






/*
*
* Logic for image, banner and footer upload -  applyDynamicWidth - saveSlide after edit*
*
*/
const bannerInput = ref(null);
const imageInput = ref(null);
const footerInput = ref(null);

const BannerFileUpload = () => {
    bannerInput.value.click();
};

const ImageFileUpload = () => {
    imageInput.value.click();
};

const FooterFileUpload = () => {
    footerInput.value.click();
};

// variables for refrence to the slide-image image div in preview and edit mode 
const slideImageRef = ref(null);
const previewImageRef = ref(null);

// calculate width from the new images aspect ratio - if the image is horizontal there is need for bigger width 
const applyDynamicWidth = (imageElement, imageRef) => {
  if (imageRef) {
    const width = imageElement.naturalWidth;
    const height = imageElement.naturalHeight;
    const aspectRatio = width / height;

    const minWidthPercent = 10;
    const squareWidthPercent = 40;
    const maxWidthPercent = 45;

    let widthPercent;
    if (aspectRatio <= 1) {
      widthPercent = minWidthPercent + (squareWidthPercent - minWidthPercent) * aspectRatio;
    } else {
      widthPercent = squareWidthPercent + (maxWidthPercent - squareWidthPercent) * (aspectRatio - 1);
    }

    const clampedWidthPercent = Math.max(minWidthPercent, Math.min(widthPercent, maxWidthPercent));
    imageRef.style.width = `${clampedWidthPercent}%`;
    imageWidthPercent.value = clampedWidthPercent;

    console.log('applyDynamicWidth:', { width: imageElement.naturalWidth, height: imageElement.naturalHeight, widthPercent: clampedWidthPercent });
  }
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

watch(() => slide.value.image, (newImage) => {
  if (newImage && previewImageRef.value) {
    loadImageAndApplyWidth(newImage, previewImageRef.value);
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

        // Skift tilbage til preview mode
        mode.value = 'preview';

         // Brug nextTick til at sikre, at alle DOM-opdateringer er færdige
         await nextTick();

        previewImageRef.value.style.width = `${imageWidthPercent.value}%`;

        
    } catch (error) {
        console.error('Error saving slide:', error);
    }
};


const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
});
</script>




<style lang="scss" scoped>

@import "@/assets/global.scss";

.flex{
    display: flex;
    align-items: center;
}

.flex p{
    margin: 0 5px 0 0;
}

header{
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

.Mode-change{
    position: absolute;
    z-index: 10;
    top: 30px;
    left: 20px;
}

.back-to-course img{
    width: 17px;
    height: auto;
    margin-right: 15px;
}

.main-div {
  position: relative;
  height: 94vh;
  color: var(--white-black-color);
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

.course-title{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.course-title h2{
    margin-top: 0;
    margin-bottom: 15px;
}

.explain{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
}
.explain b{
    margin-bottom: 15px;
}

.Slide-edit-container {
    padding: 50px;
    width: 70vw;
    max-height: 95%;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    margin: 0px auto 0px auto;
    overflow: hidden;
    transition: background-color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.preview-mode {
  background-color: var(--second-background);
  border: 1px solid #ddd; 
}

.edit-mode {
  background-color: var(--second-background);
}

.slide-main-content{
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

section h2{
    font-size: 36px;
    font-weight: bold;
    margin-top: 0;
}

section p{
    font-size: 18px;
    max-height: 80%;
    overflow: hidden;
}

section{
    display: flex !important;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 100%;
}

.slide-info-box{
    display: flex !important;
    flex-direction: column;
    justify-content: flex-start;
}

.slide-title-text-box{
    display: flex;
    flex-direction: column;
    width: 50%;
}

.slide-title-text-box input, .editable-content{
    background: none;
    border: none;
    font-family: "Open Sans", sans-serif;
    border: 1.5px dashed var(--main-button);
    outline: none;
}

.slide-title-text-box input:focus-visible, .editable-content:focus-visible{
    border: 2px solid var(--main-button);
}

.slide-title-text-box input{
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
}

.slide-title-text-box .editable-content{
    font-size: 18px;
    overflow: hidden;
    box-sizing: border-box;
}

.editable-content:empty:before {
  content: attr(placeholder);
  color: grey;
}

.save-button-box{
margin-top: 20px;
}

.slide-image{
    height: auto;
    position: relative;
    align-items: flex-start !important;
}

.slide-image img{
    width: 100%;
    height: auto;
}

.image-container-edit{
    position: relative;
    width: 40%;
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

.slide-banner, .slide-footer{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  height: 15%;
}

.slide-banner{
    margin-bottom: 15px;
}

.slide-banner img{
    width: 100%;
    height: auto;
}

.slide-footer{
    margin: 30px 0 20px 0;
}

.slide-footer img{
    width: 100%;
    height: auto;
}

.hover-box{
    width: 100%;
    height: 0;
    background: #474747;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    transition: height 0.3s ease-in-out;
    overflow: hidden;
}

.hover-box-title-visible {
    height: 40px !important;
}

.hover-box-text-visible {
    height: 40px !important;
}

.hover-box-image-visible{
    height: 40px !important;
}

.hover-box img{
    width: auto;
    height: 25px;
    transition: opacity 0.2s ease; 
    cursor: pointer;
}

.hover-box img:hover{
    opacity: 0.6;
}

.crop-div{
    width: 60%;
    justify-content: space-between;
}

button{
  padding: 12px 20px;
}

.progress-bar-div{
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
    background-color: #1F7698;
    width: 0%; /* Initial width */
}

.separator {
  height: 20px;
  border-left: 2px solid #909090;
  margin: 10px 0;
}

.crop-container{
    position: absolute;
    width: 100%;
    bottom: 0;
}

.crop-btn-div{
    width: 100%;
    margin: 0 !important;
}

@media screen and (max-width: 2000px) {

.slide-footer {
  margin: 0px;
}

section h2 {
  font-size: 30px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
}

.Slide-edit-container {
  width: 65vw;
  padding: 30px 20px 30px 20px;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.slide-title-text-box input {
  font-size: 30px;
}

.course-title h2{
  font-size: 20px;
}


}


</style>