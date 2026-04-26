<script setup lang="ts">
import SocialIcon from './SocialIcon.vue'

const props = defineProps<{
  type: 'github' | 'linkedin'
  url: string
  height?: number | string
  fill?: string
}>()
</script>

<template>
  <div class="flex items-center gap-3 my-1">
    <SocialIcon :type="type" :height="height" :fill="fill" />
    <span>{{ url }}</span>
  </div>
</template>
