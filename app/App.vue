<script setup>
  import CustomNotifications from './components/Notification/CustomNotifications.vue';
</script>

<template>
  <div style="height: 0">
    <div class="navbar">
      <div class="navbar-content">
        <span class="site-name">
          <RouterLink to="/">
            jand-web
          </RouterLink>
        </span>
      </div>
    </div>

    <CustomNotifications />

    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style>

.material-icons {
    vertical-align: bottom;
}

</style>
