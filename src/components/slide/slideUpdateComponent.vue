<template>
  <div class="update-slide-container" >

    <div class="update-slide-popup">

      <h2>Update Slide</h2>

      <div class="buttons-container">
          <button class="button" @click="toggleEditMode">{{ buttonText }}</button>
      </div>

        <!-- Input fields for editing mode -->

        <label class="input-label"> Title:
          <input v-if="editMode" type="text" v-model="updatedSlide.title" />
          <span v-else> <b>{{ slide.title }}</b> </span>
        </label>

        <label class="input-label"> Description:
          <input v-if="editMode" type="text" v-model="updatedSlide.description" />
          <span v-else> <b>{{ slide.description }}</b> </span>
        </label>

        <!-- Add other slide properties similarly, as required -->

        <button v-if="editMode" class="button Update-button" @click="updateAndClose">Update Slide</button>

      <!-- Close button -->
      <button class="close" @click="$emit('close')">x</button>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';

import { fetchSlides } from '../../modules/Crud_operator/slide/slideGetCrud';
import { lessons } from '../../modules/lessons';
import { handleUpdateSlide, setUpdatedSlide } from '../../modules/Crud_operator/slide/slideUpdateCrud';

const props = defineProps({
  showSlideUpdate: Boolean,
  slide: Object,
});

const updatedSlide = ref({ ...props.slide });
const editMode = ref(false);
const updateSuccess = ref(false);

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  updatedSlide.value = { ...props.slide };
};

const updateAndClose = async () => {
  console.log('Original Slide:', props.slide);
  console.log('Updated Slide Before Update:', updatedSlide.value);
  setUpdatedSlide(updatedSlide.value);
  updateSuccess.value = await handleUpdateSlide(updatedSlide.value);
  emit('close');
};

onMounted(async () => {
  for (const lesson of lessons.value) {
    await fetchSlides(lesson._id); 
  }
  console.log('Props Slide After Mounted:', props.slide);
});

const emit = defineEmits(['close']);
const buttonText = computed(() => (editMode.value ? 'Cancel Edit' : 'Edit Slide'));
</script>

  <style lang="scss" scoped>
  @import "@/assets/global.scss";
  
  .update-slide-container {
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
  
  .update-slide-popup {
    background-color: var(--primary-color);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    color: var(--white-black-color);
    width: 30vw;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  }
  
  .buttons-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .button-color {
    background-color: #E53935;
  }
  </style>