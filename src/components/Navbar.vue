<script setup lang="ts"></script>
<template>
  <div class="navbar bg-base-100" style="border-bottom: 1px dashed">
    <div class="flex-1">
      <div style="max-height: min-content">
        <div className="navbar-start" class="tooltip tooltip-right">
          <router-link to="/about">
            <img
              src="@/assets/wolf-icon.png"
              alt="Template logo"
              class="w-10 h-10"
            />
          </router-link>
        </div>
      </div>
    </div>
    <!-- <div class="flex-none">
      <div style="max-height: min-content">
        <div className="navbar-end mr-1" class="tooltip tooltip-right">
          <title>Blogs</title>
          <router-link to="/blog">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-8 h-8 stroke-current stroke-1.2 fill-slate-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </div> -->
  </div>
</template>
<style scoped>
.navbar {
  min-height: 3rem !important;
  background-color: transparent;
}
</style>
