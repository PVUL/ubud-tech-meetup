<script setup lang="ts">
import { computed } from 'vue'
import Image from './Image.vue'

const props = withDefaults(defineProps<{
  dark?: boolean
  light?: boolean
  size?: string | number
}>(), {
  dark: false,
  light: false,
  size: 150 
})

const logoSrc = computed(() => {
  if (props.dark) {
    return '/logo/logo-black-solid-clear-bg.png'
  }
  
  if (props.light || (!props.dark && !props.light)) {
    return '/logo/logo-white-solid-clear-bg.png' 
  }
  
  // Fallback
  return '/logo/logo-white-solid-clear-bg.png'
})
</script>

<template>
  <div class="logo-wrapper">
    <Image 
      :src="logoSrc" 
      alt="Ubud Tech Meetup Logo" 
      :width="size" 
    />
  </div>
</template>

<style scoped>
.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
