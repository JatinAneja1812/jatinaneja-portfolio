<script setup lang="ts">
import { templateConfig } from '@/config/templateConfig';
</script>

<template>
    <div class="card rounded-md" style="border: 1px solid black;">
        <div class="card-body pt-3 px-4">
            <h2 class="card-title">{{ templateConfig.abilities.title }}</h2>
            <div class="divider my-0"></div>
            <div class="grid grid-cols-12 gap-1">
                <template v-for="item in templateConfig.abilities.items" :key="item.label">
                    <div class="col-span-5 progress-label">
                        {{ item.label }}
                    </div>
                    <div class="col-span-7">
                        <progress class="progress w-full" :value="item.value" max="100"></progress>
                    </div>
                </template>
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