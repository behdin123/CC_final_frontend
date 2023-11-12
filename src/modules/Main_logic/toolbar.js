import { ref } from 'vue';


const isHoverBoxTitleVisible = ref(false);
const isHoverBoxTextVisible = ref(false);
const isHoverBoxImageVisible = ref(false);

function handleFocusText() {
    isHoverBoxTextVisible.value = true;
}

function handleFocusTitle() {
    isHoverBoxTitleVisible.value = true;
}

function handleFocusImage() {
    isHoverBoxImageVisible.value = true;
}

export {
    // to show the toolbar when clicking inside the text area
    isHoverBoxTitleVisible,
    isHoverBoxTextVisible,
    isHoverBoxImageVisible,
    handleFocusText,
    handleFocusTitle,
    handleFocusImage,
  };
  