import { ref } from 'vue';
import api from '../../../api/catalogApi.js'; // Importér den relevante API-fil. Ændre denne sti, hvis den er forkert.

const { updateCatalog } = api; // antager at updateCatalog er en funktion i din catalogApi.js fil

const updatedCatalog = ref({
  _id: '',
  name: '', 
  description: '',
  status: false,
  categories: [],
});

const categoriesInput = ref('');
const handleUpdateCatalog = async () => {
  try {
    updatedCatalog.value.categories = categoriesInput.value.split(',').map((tag) => tag.trim());

    await api.updateCatalog(updatedCatalog.value._id, updatedCatalog.value);

    return true; // Returnerer en status for succes
  } catch (error) {
    console.error('Error updating catalog:', error);
    return false; // Returnerer en status for fejl
  }
};

export {
  handleUpdateCatalog,
  updatedCatalog,
  categoriesInput
};