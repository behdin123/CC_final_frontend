<template>

    <div class="create-catalog-container" v-if="showCatalogCreation">

      <div class="create-catalog-popup">

        <h2>Create New Catalog</h2>

        <label class="input-label"> Name:
          <input type="text" v-model="newCatalog.name" />
        </label>
        <label class="input-label"> Description:
          <input type="text" v-model="newCatalog.description" />
        </label>
        <label class="input-label"> Categories:
          <input type="text" v-model="categoriesInput" placeholder="Enter categories separated by commas" />
        </label>
        <label class="input-label"> Status:
          <input type="checkbox" v-model="statusInput" />
        </label>
        <button class="button Update-button" @click="handleCreateCatalog">Create Catalog</button>

        <!-- The close button -->
        <button class="close" @click="$emit('close')">x</button>

      </div>

    </div>

  </template>
  
  <script setup>

  import {
    createCatalog,
    categoriesInput,
    newCatalog,
    statusInput,
  } from '../../modules/Crud_operator/catalog/catalogCreateCrud';
  
  import { defineProps, defineEmits, ref } from 'vue';

  import {
    closeCatalogCreation,
  } from '../../modules/Main_logic/Home';
  
  const props = defineProps({
    showCatalogCreation: Boolean,
  });
  
  const emit = defineEmits(['close']);



  const isSuccess = ref(false);
  
  const handleCreateCatalog = async () => {
    isSuccess.value = await createCatalog();
    closeCatalogCreation();
  };

  </script>
  
  <style lang="scss">
  @import "@/assets/global.scss";
  
  .create-catalog-container {
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
  
  .create-catalog-popup {
    background-color: var(--primary-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 30%;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  }
  
  .create-catalog-popup h2 {
    margin-top: 0;
    margin-bottom: 40px;
    color: var(--white-black-color);
  }
  
  .input-label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: var(--white-black-color);
    margin: 10px;
  }
  
  .button {
    background-color: var(--quaternary-color);
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    padding: 12px 30px;
    transition: background-color 0.2s ease-in-out;
    margin-top: 1rem;
  }
  
  .button:hover {
    background-color: var(--primary-hover-color);
    color: #000;
  }
  </style>
  