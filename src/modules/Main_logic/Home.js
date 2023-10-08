import { ref } from 'vue';
import { fetchCourses } from '../Crud_operator/Course/courseGetCrud'; 
import { catalogs, fetchCatalogs } from '../Crud_operator/catalog/catalogGetCrud'; 

/* const projectBackgroundImage = (project) => {
  return `url(${project.image})`;
}; */


/*
*
* Logic & Variables for showing Catalog Create popup and hanle it  
*
*/

// Tilføj en ny ref til at holde den valgte catalogID
const selectedCatalogID = ref(null);

// Create catalog popup
const showCatalogCreation = ref(false);

const openCatalogCreation = () => {
  showCatalogCreation.value = true;
};

const closeCatalogCreation = () => {
  showCatalogCreation.value = false;
};

// To control the visibility of the courseUpdateComponent.vue popup
const showCatalogUpdate = ref(false);

// To store the selected catalog for updating
const selectedCatalog = ref('');

// To open the catalogUpdateComponent.vue popup with the selected catalog
const openCatalogUpdatePopup = (catalog) => {
  console.log("Catalog received in openCourseUpdatePopup:", catalog);
  selectedCatalog.value = catalog;
  showCatalogUpdate.value = true;
};

// To close the catalogUpdateComponent.vue popup and refresh the catalogs list
const onUpdateFinished = () => {
  showCatalogUpdate.value = false;
  fetchCatalogs();
}; 




/*
*
* Logic & Variables for showing Course Update popup and hanle it  
*
*/

// Create course popup
const showCourseCreation = ref(false);

const closeCourseCreation = () => {
  showCourseCreation.value = false;
};
// To control the visibility of the courseUpdateComponent.vue popup
const showCourseUpdate = ref(false);

// To store the selected course for updating
const selectedCourse = ref('');

function openCourseCreation(catalogID) {
  showCourseCreation.value = true;
  selectedCatalogID.value = catalogID;  
}

function openCourseUpdatePopup(course) {
  console.log("Course received in openCourseUpdatePopup:", course);
  showCourseUpdate.value = true;
  selectedCourse.value = course;  
}

// To close the courseUpdateComponent.vue popup and refresh the courses list
const onUpdateFinishedCourse = async () => {
  showCourseUpdate.value = false;
  for (const catalog of catalogs.value) {
    catalog.courses = await fetchCourses(catalog._id);
  }
};



export{
    // Create course popup functions & variables
    selectedCatalogID,
    showCourseCreation,
    closeCourseCreation,
    /* projectBackgroundImage, */

    // Update course popup functions & variables
    showCourseUpdate,
    selectedCourse,
    openCourseCreation,
    openCourseUpdatePopup,
    onUpdateFinishedCourse,

    // Create catalog popup functions & variables
    showCatalogCreation,
    openCatalogCreation,
    closeCatalogCreation,

    // Update catalog popup functions & variables
    showCatalogUpdate,
    selectedCatalog,
    openCatalogUpdatePopup,
    onUpdateFinished,
};