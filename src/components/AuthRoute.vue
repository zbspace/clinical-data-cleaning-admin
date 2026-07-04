<template>
  <router-view />
</template>

<script setup lang="ts">
//#region Imports
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
//#endregion

//#region Auth Check
const router = useRouter();
const authStore = useAuthStore();

if (!authStore.token) {
  router.replace('/login');
}
//#endregion
</script>
