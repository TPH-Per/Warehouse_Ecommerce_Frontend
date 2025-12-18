<template>
    <AppHeader />
    <v-main>
        <v-container>
            <router-view />
        </v-container>
    </v-main>
    <AppFooter />

</template>

<script setup lang="ts">
    import AppHeader from '@/components/AppHeader.vue';
    import AppFooter from '@/components/AppFooter.vue';
</script>

<style scoped>

</style>