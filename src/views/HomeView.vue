<template>
  <main>

    <div class="Main-container">
      <div class="Catalog-Container">


        <div class="title-div">
          <div class="flex">
            <h1>CATALOG</h1> <h2>Welcome back to Course Creator {{ capitalizedUsername() }}</h2>
          </div>
            <b>Here you can create, edit and view catalogs and their subsequent courses</b>
        </div>

        <div class="catalog-btn-div">
            <div class="search-bar">
                <input placeholder="Search..." type="text">
            </div>
            <div class="card">
              <button @click=" openCatalogCreation();">
                NEW Catalog
                <span class="plus-icon"></span>
              </button>
            </div>
        </div>

        

        <div class="catalogs">
            <div class="catalogs-columns">
                <div class="catalog-title first-catalog-title">
                  <p>Catalog Name</p>
                </div>
                <div class="catalog-title">
                  <p>Categories</p>
                </div>
                <div class="catalog-title">
                  <p>Description</p>
                </div>
                <div class="catalog-title">
                  <p>Modified</p>
                </div>
                <div class="catalog-title" @click="openCatalogUpdatePopup()">
                  <p>Status</p>
                </div>
            </div>


        <div class="line"></div>


          <!-- Catalog creation popup -->
            <div v-for="catalog in catalogs" :key="catalog._id" >

              <div class="catalogs-columns catalogs-info">
                  <div class="catalog-title first-catalog-title">
                      <div class="edit" @click="openCatalogUpdatePopup(catalog)">
                        <img src="@/assets/pencil.png" alt="">
                        <div class="label">
                          <p>Edit catalog</p>
                        </div>
                      </div>
                      <p :class="getClassForCatalog(catalog)">{{ capitalizedCatalogName(catalog) }}</p>
                  </div>
                  <div class="catalog-title" :class="getClassForCatalog(catalog)">
                    <p>{{ catalog.categories.join(', ') }}</p>
                  </div>
                  <div class="catalog-title" :class="getClassForCatalog(catalog)">
                    <p>{{ catalog.description }}</p>
                  </div>
                  <div class="catalog-title" :class="getClassForCatalog(catalog)">
                    <p>{{ new Date(catalog.updatedAt).toLocaleDateString() }}</p>
                  </div>

                  <div class="catalog-title last-catalog-title">
                    <div :class="['circle', catalog.status ? 'circle-active' : 'circle-inactive']"></div>
                    <p  :class="getClassForCatalog(catalog)">{{ catalog.status ? 'Active' : 'Inactive' }}</p>
                  </div>

                    <div class="open-catalog-div edit" @click="toggleCatalog(catalog._id)">
                      <img v-if="!darkMode" src="@/assets/down-chevron.png">
                      <img v-else src="@/assets/down-chevron-white.png" />
                      <div class="label">
                          <p>Open catalog</p>
                      </div>
                    </div>
               </div>

                <div class="course-container" :class="{ 'course-container': true, 'course-container-open': openCatalogs.includes(catalog._id) }">

                    <div class="course-div" v-for="course in catalog.courses" :key="course._id" :class="getClassForCatalog(catalog)">
                      <div class="dark-overlay"></div>
                      <div class="course-image-div">
                        <img :src="course.image" @error="imageError"/>
                      </div>

                      <div class="course-title" :class="getClassForCatalog(catalog)">
                        <p>{{ capitalizedCourseTitle(course) }}</p>
                      </div>

                      <div @click=" openCourse(course);" class="open-course-btn" >
                        <button>Open course</button>
                      </div>

                      <div @click=" openCourseUpdatePopup(course);" class="edit-course" :class="getClassForCatalog(catalog)">
                        <img src="@/assets/pencil.png">
                      </div>

                      <div class="private-course" :class="getClassForCourse(course)">
                        <img src="@/assets/lockIcon.png">
                      </div>
                    </div>
                    
                    <div class="icon">
                      <img @click=" openCourseCreation(catalog._id);" v-if="!darkMode" class="add-new-course" src="@/assets/add.png" />
                      <img @click=" openCourseCreation(catalog._id);" v-else class="add-new-course" src="@/assets/add-dark.png" />
                      <div class="label">
                          <p>Create course</p>
                      </div>
                    </div>
                </div>

            </div>
            
        </div>

      </div>

    </div>

    

    <!-- Catalog creation popup -->
    <div class="flex">
      <div v-if="showCatalogCreation">
        <catalog-create-component @close="closeCatalogCreation" :showCatalogCreation="showCatalogCreation" />
      </div>
    </div>
    

    <!-- Catalog Update popup -->
    <catalog-update-component 
      v-if="showCatalogUpdate" 
      :catalog="selectedCatalog"
      @update-finished="onUpdateFinished">
    </catalog-update-component>




    <!-- course creation popup -->
    <div class="flex">
      <div v-if="showCourseCreation">
        <course-create-component @close="closeCourseCreation" :showCourseCreation="showCourseCreation" />
      </div>
    </div>

   
    <!-- course Update popup -->
    <course-update-component 
      v-if="showCourseUpdate" 
      :course="selectedCourse"
      @update-finished="onUpdateFinishedCourse"
      @close="closeUpdateCourse">
    </course-update-component>



  </main>
</template>


<script setup>

import { useRouter } from 'vue-router';
import { ref, defineProps, watch, onMounted } from 'vue';

import { capitalizedUsername } from '../modules/Main_logic/UserProfile';

import { fetchCourses } from '../modules/Crud_operator/Course/courseGetCrud'; 

import { catalogs, fetchCatalogs } from '../modules/Crud_operator/catalog/catalogGetCrud';

// Catalog & Course popup component import 
import courseCreateComponent from '../components/course/courseCreateComponent.vue';
import catalogCreateComponent from '../components/catalog/catalogCreateComponent.vue';
import courseUpdateComponent from '../components/course/courseUpdateComponent.vue';
import catalogUpdateComponent from '../components/catalog/catalogUpdateComponent.vue';

import {
    // Create course popup functions & variables
    selectedCatalogID,
    showCourseCreation,
    closeCourseCreation,
    showCatalogCreation,
    openCatalogCreation,
    closeCatalogCreation,
    /* courseBackgroundImage, */

    // Update course popup functions & variables
    showCourseUpdate,
    selectedCourse,
    openCourseCreation,
    openCourseUpdatePopup,
    onUpdateFinishedCourse,
    closeUpdateCourse,

    showCatalogUpdate,
    selectedCatalog,
    openCatalogUpdatePopup,
    onUpdateFinished,
    
    // Image placeholder for error in showing a image
    imageError,

    // capitalize the first letter for name and titles
    capitalizedCatalogName,
    capitalizedCourseTitle,

} from '../modules/Main_logic/Home';



/*
* composition function useRouterCustom(), which creates an instance of the router and 
* then exports an openProject function that uses this instance to navigate to the 
* ProjectBoard page.
*/
const useRouterCustom = () => {
  
  const router = useRouter();

  // To open a course interface and edit the slide inside the course overview
  const openCourse = (course) => {
    router.push({ name: 'CourseBoard', params: { id: course._id } });
  };
  return {
    openCourse
  }
}

const { openCourse } = useRouterCustom();


const openCatalogs = ref([]);

function toggleCatalog(id) {
  const index = openCatalogs.value.indexOf(id);
  if (index === -1) {
    openCatalogs.value.push(id);
  } else {
    openCatalogs.value.splice(index, 1);
  }
}


/*
* Logic that is defined in watch and onMounted
*/

// watch: when showCourseCreation is getting closed, then it calls the fetchCourses function to get the updated list of courses
watch(showCatalogCreation, async (newValue, oldValue) => {
  if (!newValue && oldValue) {
    await fetchCatalogs();
  }
});


watch(showCourseCreation, async (newValue, oldValue) => {
  if (!newValue && oldValue) {
    for (const catalog of catalogs.value) {
      catalog.courses = await fetchCourses(catalog._id);
    }
  }
});


// onMounted: When the component is mounted, fetchCourses function is called to fetch a list of courses to show in HomeView.vue
onMounted(async () => {
  await fetchCatalogs();
  for (const catalog of catalogs.value) {
    catalog.courses = await fetchCourses(catalog._id);
  }
});

const props = defineProps({
  darkMode: Boolean,
  toggleDarkMode: Function
});

const getClassForCatalog = (catalog) => {
  return catalog.status ? 'active-catalog-class' : 'inactive-catalog-class';
};

const getClassForCourse = (course) => {
  return course.private ? 'private-course-class' : 'not-private-course-class';
};

</script>



<style lang="scss" scoped>

@import "@/assets/global.scss";

.last-catalog-title{
  width: 10% !important;
  padding-right: 0 !important;
}

.inactive-catalog-class{
  opacity: 0.5 !important;
}

.edit img:hover ~ .label {
  opacity: 1;
  height: 30px;
}

.icon img:hover ~ .label {
  opacity: 1;
  height: 30px;
}

.icon .label{
  margin-left: 40px;
  margin-bottom: 275px;
}

.icon{
  position: relative;
}

body {
  margin: 0;
  padding: 0;
}

main {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  min-height: 91.5vh;
  margin-top: 54px !important;
  background-color: var(--main-background);
}

.Main-container{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
}

.Catalog-Container{
  width: 90vw;
  background-color: var(--second-background);
  color: var(--white-black-color);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  min-height: 500px;
  margin-bottom: 60px;
  padding-bottom: 60px;
}

.flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-div{
  display: flex;
  flex-direction: column;
  color: var(--white-black-color);
  padding-left: 35px;
}

.title-div h1{
  font-weight: bold;
  font-size: 36px;
  margin-bottom: 10px;
  margin-top: 20px;
}

.title-div h2{
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 10px;
  margin-top: 20px;
  padding-right: 17px;
}


.title-div b{
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
}

.catalog-btn-div{
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  margin: 11px 0;
}

.search-bar{
  width: 30%;
}

.search-bar input[type="text"] {
   display: block;
   width: 100%;
   padding: 13px 15px;
   padding-left: 60px;
   background-color: #EFEFEF;
   font-size: 16px;
   box-sizing: border-box;
   background-image: url('@/assets/search.png');
   background-position: 16px 10px;
   background-repeat: no-repeat;
   background-size: 25px;
   opacity: 0.45;
   border: none;
}

.open-course-btn{
  position: absolute;
  left: auto;
  right: auto;
  opacity: 0;
  transition: opacity 0.5s ease-in;
  z-index: 2;
}

.open-course-btn button{
  background-color: var(--main-button);
  display: flex;
  align-items: center;
  text-transform: uppercase;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 12px 30px;
  transition: background-color 0.1s ease-in-out;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.568);
}

.course-div:hover .dark-overlay {
  opacity: 1;
}

.dark-overlay {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.676);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-image-div{
  width: 180px;
  height: auto;
}

.course-image-div img{
  width: 100%;
  height: auto;
}

.add-new-course{
  width: 235px;
  height: auto;
  margin-bottom: 20px;
  margin-right: 2%;
  transition: opacity 0.3s ease;
}

.add-new-course:hover{
  opacity: 0.6;
  cursor: pointer;
}

.edit-course{
  opacity: 0;
  z-index: 2;
  width: 25px;
  height: auto;
  position: absolute;
  bottom: 10px;
  right: 10px;
  transition: opacity 0.5s ease-in;
  cursor: pointer;
}

.edit-course img{
  width: 100%;
  height: auto;
}

.course-div:hover .edit-course{
  opacity: 1;
}

.course-div:hover .open-course-btn{
  opacity: 1;
}

.private-course{
  z-index: 2;
  width: 25px;
  height: auto;
  position: absolute;
  bottom: 10px;
  left: 10px;
  transition: opacity 0.5s ease-in;
  cursor: pointer;
}

.not-private-course-class{
  opacity: 0 !important;
}

.private-course img{
  width: 100%;
  height: auto;
}


.catalogs-columns{
  display: flex;
  font-weight: bold;
  font-size: 16px;
}

.first-catalog-title{
  margin-left: 35px;
}

.edit{
  position: relative;
  margin-right: 15px;
  width: 25px;
  height: auto;
  cursor: pointer;
}

.edit img:hover{
  filter: drop-shadow(16px 16px 20px red) invert(75%);
  opacity: 2;
}

.edit img{
  width: 100%;
  height: auto;
  transition: filter 0.2s ease-in-out; 
  opacity: 1; 
}

.open-catalog-div{
  width: 25px;
  height: auto;
  align-items: center;
  display: flex;
}

.open-catalog-div :hover{
  opacity: .5;
  cursor: pointer;
}

.open-catalog-div img{
  width: 100%;
  height: auto;
}

.catalog-title{
  width: 15%;
  padding-right: 4%;
  display: flex;
  align-items: center;
}

.catalogs-info{
  font-weight: 400;
}

.catalogs-info p{
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
}

.course-container {
  max-height: 0;
  min-height: 0;
  height: 0;
  background-color: var(--container-background);
  display: flex;
  align-items: center;
  padding: 0 0 0 35px;
  flex-wrap: wrap;
  overflow: hidden;
  transition: height 0.5s ease-in ,max-height 0.5s ease-in, min-height 0.5s ease-in ,padding 0.5s ease;
}

.course-container-open {
  min-height: 300px;
  max-height: 1000px;
  height: auto;
  padding: 45px 0 45px 35px;
}

.course-div{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 235px;
  height: 262px;
  margin-right: 2%;
  margin-bottom: 20px;
  background-color: var(--primary-color);
  cursor: pointer;
}

.course-title{
  font-size: 14px;
  font-weight: 400;
}

.course-title p{
  margin-bottom: 0;
}

.circle{
  min-height: 10px;
  min-width: 10px;
  border-radius: 50%;
  margin-right: 20px;
}

.circle-inactive {
  background-color: #F27F81;
}

.circle-active {
  background-color: #2B8852;
}

main h2 {
  font-size: 25px !important;
  font-weight: lighter;
  margin-top: 5px;
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.title h1{
  color: var(--white-black-color);
}

.project-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 50px 6.6%;
  box-sizing: border-box;
  padding-top: 20px;
}

.project {
  color: #fff;
  border: 1px solid var(--white-black-color);
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  padding: 10px;
  margin-bottom: 30px;
  width: 600px;
  height: 200px;
  padding-left: 30px;
  position: relative;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project:hover{
  transform: scale(1.03);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

.project::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1;
  border-radius: 5px;
}

.project-content {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  height: 100%;
}

.project-btn-margin{
  margin: 0 10px 10px 0;
}

.project h2 {
  font-size: 20px;
  margin: 0 0 5px;
}

.project p {
  font-size: 14px;
  margin: 0;
  width: 370px;
}

.edit-button{
  margin-top: 20px;
}

</style>
