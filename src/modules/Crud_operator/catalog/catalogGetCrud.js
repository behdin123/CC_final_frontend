import { ref } from 'vue';
import api from '../../../api/catalogApi.js'; 
import { fetchCourses } from '../Course/courseGetCrud'; 

/* 
*
* Get Catalog 
*
*/
const catalogs = ref([]);

const fetchCatalogs = async () => {
  try {
    const fetchedCatalogs = await api.getAllCatalogs();
    for (const catalog of fetchedCatalogs) {
      catalog.courses = await fetchCourses(catalog._id);
    }

    console.log("Fetched catalogs:", fetchedCatalogs);

    // Sort catalogs by creation date in descending order (newest first)
    fetchedCatalogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    catalogs.value = fetchedCatalogs;

  } catch (error) {
    console.error('Error fetching catalogs:', error);
  }
};

export {
  catalogs,
  fetchCatalogs,
};