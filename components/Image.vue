<script setup lang="ts">
/**
 * Image
 * 
 * This component is used as a generic wrapper for images in our slides.
 * 
 * WHY WE NEED THIS:
 * Slidev (and Vite) has specific ways of handling assets. When we are 
 * working with a project structure where slides are nested in subdirectories 
 * (like talks/paul-yun/*.md), loading assets from outside the slides 
 * directory at runtime can be problematic if using raw relative paths.
 * 
 * This component provides a centralized way to handle image paths, ensuring 
 * that assets (especially those in the public/ directory) are resolved 
 * correctly regardless of where the slide is located.
 * 
 * Example use:
 * 
 *    import Image from '~/components/Image.vue'
 * 
 *    <Image src="/photos/2026-04-07.jpg" width="400" />
 *   
 */
import { computed } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

// image must be accessible from the /assets directory
const images = import.meta.glob('../assets/**/*.{png,jpg,jpeg,svg,webp}', { eager: true, query: '?url', import: 'default' })

// Resolve the path dynamically.
// We assume the src prop starts with a slash (e.g. '/logo/...').
// By resolving it via import.meta.glob, Vite can bundle the asset
// even if Slidev is run from a nested directory.
const resolvedSrc = computed(() => {
  if (props.src && props.src.startsWith('/')) {
    const key = `../assets${props.src}`
    return (images[key] as string) || props.src
  }
  return props.src
})
</script>

<template>
  <img 
    :src="resolvedSrc" 
    :alt="alt || ''" 
    :width="width" 
    :height="height" 
    class="image-component"
  />
</template>

<style scoped>
.image-component {
  display: inline-block;
  max-width: 100%;
}
</style>
