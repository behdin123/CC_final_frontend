<template>
    <div class="update-catalog-container">
  
      <div class="update-catalog-popup">
  
        <h2>Update Catalog</h2>
  
        <div class="buttons-container">
          <button class="button" @click="toggleEditMode">{{ buttonText }}</button>
        </div>
  
        <!-- Input fields for editing mode -->
  
        <label class="input-label"> Title:
          <input v-if="editMode" type="text" v-model="updatedCatalog.name" />
          <span  v-else> {{ catalog.name }} </span>
        </label>
  
        <label class="input-label"> Description:
          <input v-if="editMode" type="text" v-model="updatedCatalog.description" />
          <span class="catalog-description"  v-else> {{ catalog.description }} </span>
        </label>
  
        <label class="input-label"> Categories:
          <input v-if="editMode" type="text" v-model="categoriesInput" placeholder="Enter categories separated by commas" />
          <span v-else>{{ catalog.categories.join(', ') }}</span>
        </label>
  
        <label class="input-label"> Private:
          <input 
            v-if="editMode"
            class="checkbox"
            type="checkbox" 
            :checked="catalog.status"
            @change="updatedCatalog.status = $event.target.checked"
          />
          <span v-else>{{ catalog.status ? 'Yes' : 'No' }}</span>
        </label>
  
        <button v-if="editMode" class="button Update-button" @click="updateAndClose">Update Catalog</button>
        <button v-else class="button button-color" @click="removeCatalogAndClose">Remove</button>
  
        <!-- Close button -->
        <button class="close" @click="$emit('update-finished')">x</button>
  
      </div>
  
    </div>
  </template>
  
   
  <script setup>
  import { ref, watchEffect, defineProps } from 'vue';
  
  import {
    handleUpdateCatalog,
    updatedCatalog,
    categoriesInput,
  } from '../../modules/Crud_operator/catalog/catalogUpdateCrud';

  import {
    onUpdateFinished,
  } from '../../modules/Main_logic/Home';
  
  import { removeCatalog } from '../../modules/Crud_operator/catalog/catalogRemoveCrud';
  
  const props = defineProps({
    catalog: Object,
  });
  
  watchEffect(() => {
    const newCatalog = props.catalog;
    if (newCatalog && newCatalog.categories) { 
      Object.assign(updatedCatalog.value, newCatalog);
      categoriesInput.value = newCatalog.categories.join(', ');
    }
  });
  
  const updateSuccess = ref(false);
  
  const updateAndClose = async () => {
    updateSuccess.value = await handleUpdateCatalog();
  };

  watchEffect(() => { 
    if (updateSuccess.value) { 
        onUpdateFinished();
    }
  });
  
  const removeCatalogAndClose = async () => {
    await removeCatalog(props.catalog._id);
    onUpdateFinished();
  };
  
  const editMode = ref(false);
  const buttonText = ref('Switch to Edit Mode');
  
  const toggleEditMode = () => {
    editMode.value = !editMode.value;
    buttonText.value = editMode.value ? 'Cancel' : 'Switch to Edit Mode';
  };
  
  </script>


<style lang="scss" scoped>
@import "@/assets/global.scss";
.update-catalog-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.update-catalog-popup {
    background-color: var(--primary-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    color: var(--tertiary-color);
    width: 45%;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
    border-radius: 8px;
}

.catalog-description{
    width: 300px;
    text-align: right;
}

.input-label {
    align-items: center;
}

.catalog-image{
    width: 200px;
    height: 100px;
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
    border-radius: 5px;
}

.buttons-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
}

.button-color{
  background-color: #E53935;
}

</style>