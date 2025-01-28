<template>
  <div ref="canvasContainer" class="canvas-container" ></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import AmmoModule from 'ammojs-typed'; 
import ThreeDimensionalEnvironment from '../three/ThreeDimensionalEnvironment'

export default defineComponent({
  name: 'ThreeScene',
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);

    const LoadAmmo = async () => {
        const ammo: any = await new (AmmoModule as any)();
        if (!canvasContainer.value) {
          return;
        }
        const containerElement = canvasContainer.value;

        const enviroment: InstanceType<typeof ThreeDimensionalEnvironment>  = new ThreeDimensionalEnvironment(ammo,containerElement);
        enviroment.animate();
    };
    
    onMounted(() => {  
      LoadAmmo(); 
    });

    return {
      canvasContainer,
      LoadAmmo, 
    };
  },
});
</script>