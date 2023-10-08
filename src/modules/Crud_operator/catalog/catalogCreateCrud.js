import { ref } from 'vue';
import api from '../../../api/catalogApi.js';

/* 
*
* Create Catalog 
*
*/

// Create a ref to store the new catalog data
let newCatalog = ref({
    name: '',
    description: '',
    categories: [],
    status: false
});

// Create a ref to store the status of the new catalog
let statusInput = ref(false);

// Create a ref to store the input value for categories
let categoriesInput = ref('');

// Function to create a new catalog, and call the API to save the catalog
const createCatalog = async () => {
    newCatalog.value.status = statusInput.value; 
    newCatalog.value.categories = categoriesInput.value.split(',').map(category => category.trim());
    try {
        const response = await api.createCatalog(newCatalog.value);
        if (response && response.status === 200) {
          // Optionally, you could reset newCatalog and categoriesInput here
          newCatalog.value = {
            name: '',
            description: '',
            categories: [],
            status: false
          };
          categoriesInput.value = '';
          return true; // Return success status
        }
        return false; // Return failure status if API response is not OK
    } catch (error) {
        console.error('Error creating catalog:', error);
        return false; // Return failure status
    }
};

// Export the functions and variables for use in your Vue component
export {
    createCatalog,
    categoriesInput,
    newCatalog,
    statusInput,
};