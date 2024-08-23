<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation" />
        <v-divider />
        <v-list-item link title="Users" to="/" />
        <v-list-item link title="Roles" to="roles" />
        <v-list-item link title="Rights" to="rights" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :title="appStore.pageHeader" />

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <router-view />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useAppStore } from '../stores/app';
const appStore = useAppStore();
</script>
