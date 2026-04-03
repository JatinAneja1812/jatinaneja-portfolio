<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";

const toolkitSections = [
  { title: "Languages", values: templateConfig.profile.toolkit.languages },
  { title: "Frameworks/Stack", values: templateConfig.profile.toolkit.frameworks },
  { title: "Databases", values: templateConfig.profile.toolkit.databases },
  { title: "Tools", values: templateConfig.profile.toolkit.tools }
];
</script>

<template>
    <div class="card rounded-md" style="border: 1px solid black; overflow-y: auto;">
        <div class="card-body pt-3 px-4">
            <h1 class="card-title">{{ templateConfig.profile.heading }}</h1>
            <div class="divider my-0"></div>
            <div>
                <p>
                    {{ templateConfig.profile.intro }}
                </p>
                <div class="mt-1 font-ppen font-ppen-bold">My Toolkit:</div>
                <ul class="list-disc list-inside ml-2">
                    <li v-for="section in toolkitSections" :key="section.title">
                      <span class="italic underline">{{ section.title }}:</span>
                      {{ section.values.join(', ') }}
                    </li>
                </ul>
                <div class="divider my-2"></div>
                <div class="font-ppen font-ppen-bold mt-1">What I Do:</div>
                <ul class="list-disc list-inside ml-2">
                    <li v-for="item in templateConfig.profile.whatIDo" :key="item">{{ item }}</li>
                </ul>
                <div class="font-ppen font-ppen-bold mt-1">Current Focus:</div>
                <p>
                    {{ templateConfig.profile.currentFocus }}
                </p>
            </div>
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
</style>