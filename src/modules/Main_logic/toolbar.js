import { ref } from 'vue';


const isHoverBoxTitleVisible = ref(false);
const isHoverBoxTextVisible = ref(false);

function handleFocusText() {
    isHoverBoxTextVisible.value = true;
}

function handleFocusTitle() {
    isHoverBoxTitleVisible.value = true;
}

export {

    // to show the toolbar when clicking inside the text area
    isHoverBoxTitleVisible,
    isHoverBoxTextVisible,
    handleFocusText,
    handleFocusTitle,
  };
  