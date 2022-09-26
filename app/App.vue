<script setup>
  import CustomNotifications from './components/Notification/CustomNotifications.vue';
</script>

<template>
  <div style="height: 0">
    <div class="navbar">
      <div class="navbar-content">
        <span class="site-name">
          <a href="/">
            jand-web
          </a>
        </span>
      </div>
    </div>

    <CustomNotifications />

    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>

</style>
