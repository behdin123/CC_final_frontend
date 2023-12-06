<template>
    <div v-if="isVisible" class="alert-overlay">
        <div class="alert-box">
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="alert-actions">
                <button class="delete" @click="confirmAction">Delete</button>
                <button class="cancel" @click="cancelAction">Cancel</button>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
title: String,
message: String
});

const emits = defineEmits(['confirm', 'cancel']);

const isVisible = ref(false);

const show = () => {
isVisible.value = true;
};

const hide = () => {
isVisible.value = false;
};

const confirmAction = () => {
    emits('confirm');
    hide();
  };

const cancelAction = () => {
    emits('cancel');
    hide();
  };

defineExpose({ show, hide });
</script>

  
<style lang="scss" scoped>
@import "@/assets/global.scss";

.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.alert-box {
  background-color: var(--primary-color);
  padding: 4rem;
  width: 21%;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 15%;
  justify-content: space-around;
}

.alert-box h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--white-black-color);
}

.alert-box p {
  color: var(--white-black-color);
}

.alert-actions {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.alert-actions button {
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 12px 30px;
  margin: 0 10px;
  transition: background-color 0.2s ease-in-out;
}

.alert-actions button:hover {
  background-color: var(--primary-hover-color);
  color: #000;
}

.delete {
  background-color: #CD1619;
}

.cancel {
  background-color: var(--main-button);
}

</style>