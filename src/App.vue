<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="['HomeView']">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>
