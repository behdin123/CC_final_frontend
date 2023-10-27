import { ref } from 'vue';

import { first_name } from '../Crud_operator/User/userGetCrud';

let showPopup = ref(false);

const capitalizedUsername = () => {
  if (!first_name.value) return '';
  return first_name.value.charAt(0).toUpperCase() + first_name.value.slice(1);
};

const imageError = (event) => {
  event.target.src = "@/assets/profile-placeholder.png";
};

export {
    showPopup,
    capitalizedUsername,
    imageError,
  };
