<script setup>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
const config = {
  dir: 'ttb',
  wrapAround: true,
  itemsToShow: 1.3,
  snapAlign: 'center',
  height: `${window.innerHeight * 0.95}px`,
  gap: 5,
  transition: 200,
};

</script>

<template>
  <!-- <div v-if="$isMobile()">MOBILE</div>
  <div v-else>DESKTOP OR TABLET</div> -->
  <div class="flex justify-center items-center">
    <Carousel v-bind="config" >
      <Slide v-for="slide in 10" :key="slide">
        <div class="card card-compact bg-base-100 w-96 h-100 carousel__item rounded-md border-2 border-base-200">
          <figure class="p-2">
            <img
              class="h-full w-full object-cover rounded-md"
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div class="card-body py-0">
            <h2 class="card-title">Shoes!</h2>
            <div class="card-actions mt-1">
                <div class="badge badge-ghost badge-outline">10/12/2002</div>
            </div>
          </div>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<style scoped>


.carousel__item {
  height: 100%;
  width: 100%;
}

.carousel__slide {
  opacity: 0.7;
  transform: scale(0.9);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.carousel__slide--active {
  opacity: 1;
  transform: scale(1);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.card figure {
  height: 75%;
}

.card-body {
  padding: 0.5rem;
  padding-top: 0;
}
</style>
