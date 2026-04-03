<script setup lang="ts">
import { ref } from 'vue';
import { templateConfig } from '@/config/templateConfig';

const emailLabel = ref("Email");

const copyEmail = () => {
  navigator.clipboard.writeText(templateConfig.contact.email);
  emailLabel.value = "Copied!!";

  setTimeout(() => {
    emailLabel.value = "Email";
  }, 1000);
};

const openLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
</script>

<template>
    <div class="card rounded-md" style="border: 1px solid black;">
        <div class="card-body pt-3 px-0">
            <h2 class="card-title px-4">Links </h2>
            <div class="divider my-0 mx-0 px-4"></div>
            <p class="flex justify-center items-center flex-col gap-2 mx-3">
                <button  @click="copyEmail()" class="btn btn-outline btn-primary btn-sm w-full font-ppen font-ppen-bold">
                    {{ emailLabel }}
                </button>
              <button
                v-for="link in templateConfig.contact.links"
                :key="link.label"
                @click="openLink(link.url)"
                class="btn btn-outline btn-primary btn-sm w-full font-ppen font-ppen-bold"
              >
                {{ link.label }}
                </button>
            </p>
        </div>
    </div>
</template>

<style scoped>
 .card-title{
    font-family: 'PPEN';
    font-weight: 400;
    font-style: normal;
    font-size: 1.5rem;
    margin-top: 5px;
 }

 button {
    font-size: 0.9rem;
 }
</style>