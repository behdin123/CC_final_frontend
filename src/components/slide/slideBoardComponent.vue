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
                            <div class="slide-image" v-if="slide.image" ref="previewImageRef">
                                <img :src="slide.image">
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
                            <div class="slide-image editable-field" ref="slideImageRef">
                                <img v-if="!slide.image" src="@/assets/image_placeholder.jpg">
                                <img v-if="slide.image && !selectedImageUrl" :src="slide.image">
                                <img v-if="selectedImageUrl" :src="selectedImageUrl" alt="Slide Image"/>

                                <div class="overlay">
                                    <input class="input uploadBtn" type="file" @change="event => onFileChange(event.target.files[0], 'image')" accept="image/*" ref="imageInput">
                                    <div class="text newImage" @click="ImageFileUpload">Upload new Image</div>
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
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import {
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

 // to show the toolbar when clicking inside the text area
 isHoverBoxTitleVisible,
 isHoverBoxTextVisible,
 handleFocusText,
 handleFocusTitle,
} from '../../modules/Main_logic/toolbar.js';

import { debounce } from 'lodash-es';

const route = useRoute();
const router = useRouter();

const goBack = () => {
    router.go(-1); // Go one page back
};


// fetches the slideId
const slideId = route.params.id;
const slide = ref({});


onMounted(async () => {
    //fetches the slide values by slideId with fetchSlideById
    try {
        slide.value = await fetchSlideById(slideId);

        // takes the slide values and sets it equal to the edit values for edit mode
        editableSlide.value = { ...slide.value };

        await nextTick();

        // takes the imageWidthPercent and sets it equal to the width og previewImageRef with is the ref to slide-image image div in preview mode
         if (slide.value.imageWidthPercent) {
            if (mode.value === 'preview' && previewImageRef.value) {
                previewImageRef.value.style.width = `${slide.value.imageWidthPercent}%`;
            } 
        }
    } catch (error) {
        console.error("Error fetching slide:", error);
    }
});

const currentSlide = ref(1); // Start fra slide 1
const totalSlides = ref(0); // Antallet af slides
const courseId = ref(null);


onMounted(async () => {
    courseId.value = route.params.courseId;
    const slideIndex = parseInt(route.params.slideIndex, 10);
    console.log("Received courseId:", courseId.value, "Received slideIndex:", slideIndex);
    try {
        const slides = await fetchSlidesByCourse(courseId.value);
        slidesByCourse.value = slides;
        totalSlides.value = slides.length;
        currentSlide.value = slideIndex + 1;
        console.log("Total slides:", totalSlides.value, "Current slide:", currentSlide.value);
    } catch (error) {
        console.error('Error fetching slides:', error);
    }
});

// Opdaterer progress bar baseret på den nuværende slide
const progressBarWidth = computed(() => (currentSlide.value / totalSlides) * 100);

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
    // Antag at du har en måde at hente slide ID baseret på index. 
    const slideId = getSlideIdByIndex(slideIndex); 
    router.push({ name: 'SlideBoard', params: { id: slideId, courseId: courseId.value, slideIndex: slideIndex } });
};

// Funktion til at finde slide ID baseret på index. 
// Du skal implementere denne funktion baseret på, hvordan du gemmer slides-data.
const getSlideIdByIndex = (index) => {
    // Implementer logikken for at finde slide ID her
    return slidesByCourse.value[index]._id;
};

const displayCurrentSlide = async () => {
    try {
        const slide = await fetchSlideById(slideId);
        // Opdater din komponenttilstand med den nye slide-data
        // For eksempel, hvis du viser slide-titel eller indhold
        // currentSlideData.value = slide;
    } catch (error) {
        console.error('Error fetching slide:', error);
    }
};

watch(() => route.params, (newParams) => {
    // Opdaterer currentSlide og henter data, når URL-parametre ændres
    courseId.value = newParams.courseId;
    const slideIndex = parseInt(newParams.slideIndex, 10);
    currentSlide.value = slideIndex + 1;
    displayCurrentSlide();
    // Du kan også tilføje logikken for at hente slide-data her, hvis det er nødvendigt
}, { immediate: true });





// 2 Modes for this page - preview mode for showing the slide & edit mode for 
const mode = ref('preview');
const editableSlide = ref({});
const toggleMode = () => {
    mode.value = mode.value === 'preview' ? 'edit' : 'preview';
};

watch(mode, async (newMode) => {
  // Vent på at DOM-opdateringer er færdige
  await nextTick();

  console.log('Mode changed to:', newMode);
  console.log('Image width percent:', slide.value.imageWidthPercent);
  console.log('Preview image ref:', previewImageRef.value);
  console.log('Slide image ref:', slideImageRef.value);
  console.log('selectedImageUrl:', selectedImageUrl.value);

  if (newMode === 'preview') {
    if (previewImageRef.value) {
      previewImageRef.value.style.width = `${slide.value.imageWidthPercent}%`;
      selectedImageUrl.value = '';
    }
    debounceUpdateContent.cancel();
    isHoverBoxTextVisible.value = false;
  } else if (newMode === 'edit') {
    if (slideImageRef.value) {
      slideImageRef.value.style.width = `${slide.value.imageWidthPercent}%`;
    }
    // Opdater textAreaRef hvis det er defineret og der er tekst at vise
    if (textAreaRef.value && editableSlide.value.text) {
        textAreaRef.value.innerHTML = editableSlide.value.text;
    }
  }
});

// Logic for the slide.text edit and update the text style
const textAreaRef = ref(null);

// update behavior
const updateContent = () => {
    const textAreaElement = textAreaRef.value;
    if (textAreaElement) {
        editableSlide.value.text = textAreaElement.innerHTML; 
    }
};

const debounceUpdateContent = debounce(updateContent, 500);


// Function to increase font size of selected text
function increaseFontSize() {
    applyStyleToSelection('increase');
}

// Function to decrease font size of selected text
function decreaseFontSize() {
    applyStyleToSelection('decrease');
}

function applyStyleToSelection(action) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return; // Do nothing if no text is selected

    let spanToStyle;

    // Tjek om den valgte tekst er indkapslet i en span
    let parentNode = range.commonAncestorContainer;
    if (parentNode.nodeType !== Node.ELEMENT_NODE) {
        parentNode = parentNode.parentNode;
    }

    if (parentNode.nodeName === 'SPAN' && range.toString() === parentNode.textContent) {
        // Brug eksisterende span, hvis det kun dækker det valgte område
        spanToStyle = parentNode;
    } else {
        // Ellers, opret ny span omkring det valgte tekst
        spanToStyle = document.createElement('span');
        spanToStyle.textContent = selectedText;
        range.deleteContents();
        range.insertNode(spanToStyle);
    }

    // Beregn og anvend den nye skriftstørrelse
    const currentFontSize = parseInt(window.getComputedStyle(spanToStyle, null).fontSize);
    const newFontSize = action === 'increase' ? currentFontSize + 1 : Math.max(12, currentFontSize - 1);
    spanToStyle.style.fontSize = `${newFontSize}px`;

    // Opdater valget
    const newRange = document.createRange();
    newRange.selectNodeContents(spanToStyle);
    selection.removeAllRanges();
    selection.addRange(newRange);

    updateEditableContent();
}




function applyStyle(styleType) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    if (range.collapsed) return; // Intet er valgt

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
            return; // Ugyldig styleType
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

    // Opdater valget for at bevare det oprindelige valgte område
    selection.removeAllRanges();
    selection.addRange(range);

    updateEditableContent();
}







function updateEditableContent() {
    // Opdater indholdet i det redigerbare område
    if (textAreaRef && textAreaRef.value) {
        editableSlide.value.text = textAreaRef.value.innerHTML;
    }
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





function applyPlainText() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // Intet er valgt

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

    // Update the editable content's innerHTML
    updateEditableContent();
}

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

    // Opdater range
    const newRange = document.createRange();
    newRange.setStart(startContainer, startOffset);
    newRange.setEnd(endContainer, endOffset);
    return newRange;
}

function unwrapElement(el) {
    const parent = el.parentNode;
    while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
    parent.normalize(); // Flet sammenhængende tekstnoder
}


function removeEmptyElements(element) {
    const elements = element.querySelectorAll('span, div');
    elements.forEach(el => {
        // Tjekker om elementet er et span eller div uden direkte tekstindhold
        if (!el.textContent.trim()) {
            unwrapElement(el);
        } else if (el.tagName === 'SPAN' && !el.style.cssText.trim()) {
            // Tjekker om alle børnelementer er spans uden yderligere indhold eller stil
            let allChildrenAreEmptySpans = Array.from(el.children).every(child => 
                child.tagName === 'SPAN' && !child.textContent.trim() && !child.style.cssText.trim()
            );

            if (allChildrenAreEmptySpans) {
                unwrapElement(el);
            }
        }
    });
}



watch(() => editableSlide.value.text, (newText) => {
  if (textAreaRef.value) {
    // Fjern tomme spans og divs fra det redigerbare område
    removeEmptyElements(textAreaRef.value);
  }
}, { deep: true });








// variables for banner, image and footer and the functions to choose a new image for them
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

    const minWidthPercent = 15;
    const squareWidthPercent = 40;
    const maxWidthPercent = 50;

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


const saveSlide = async () => {
    try {
        updatedSlide.value._id = slideId;
        updatedSlide.value.title = editableSlide.value.title;
        updatedSlide.value.text = editableSlide.value.text;

        // Update slide
        await handleUpdateSlide();

        // Reload slide data
        slide.value = await fetchSlideById(slideId);

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
  padding-top: 40px;
}

.Mode-change{
    position: absolute;
    z-index: 10;
    top: 40px;
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
    height: 85%;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    margin: 0px auto 0px auto;
    overflow: hidden;
    transition: background-color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
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
}

section h2{
    font-size: 36px;
    font-weight: bold;
    margin-top: 0;
}

section p{
    font-size: 18px;
    max-height: 480px;
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
    width: 300px;
    height: auto;
    position: relative;
    align-items: flex-start !important;
}

.slide-image img{
    width: 100%;
    height: auto;
}

@media screen and (min-width: 2000px) {
  .slide-image {
    width: 300px;
  }
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
    margin-bottom: 30px;
    
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

.hover-box img{
    width: auto;
    height: 30px;
    transition: opacity 0.2s ease; 
    cursor: pointer;
}

.hover-box img:hover{
    opacity: 0.6;
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
    background-color: blue;
    width: 0%; /* Initial width */
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
  height: 90%;
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