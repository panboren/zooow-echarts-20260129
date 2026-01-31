<template>
  <div class="home">
    <ChartThemeSwitcher />
    <StunningMasterGallery />
  </div>

</template>

<script setup>
import StunningMasterGallery from './compoments/stunning-master-gallery.vue'
import ChartThemeSwitcher from '@/components/ChartThemeSwitcher/index.vue'
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 0;
  overflow-y: auto;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}
</style>
