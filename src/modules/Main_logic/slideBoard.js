import { ref } from 'vue';
import { useRouter } from "vue-router";

import placeholderBanner from "@/assets/placeholder-banner.png";
import placeholderImage from "@/assets/Image_placeholder.jpg";
import placeholderVideo from "@/assets/videoPlaceholder.png";

/*
 *
 * When a Image has error, then show the palceholder image *
 *
 */
const bannerError = (event) => {
    event.target.src = placeholderBanner;
  };
  
const imageError = (event) => {
    event.target.src = placeholderImage;
};

const VideoError = (event) => {
    event.target.src = placeholderVideo;
};





/*
 *
 * 2 Modes for this page - preview mode for showing the slide & edit mode *
 *
 */
const mode = ref("preview");
const editableSlide = ref({});

const toggleMode = () => {
  mode.value = mode.value === "preview" ? "edit" : "preview";
};




export {
  bannerError,
  imageError,
  VideoError,
  
  mode,
  editableSlide,
  toggleMode,
};