<script setup lang=ts>
  import CustomNotifications from './components/Notification/CustomNotifications.vue';
  import FatalError from './http/FatalError';
  import userClient from './http/userClient';
  import { useRouter } from 'vue-router'
  
  const router = useRouter()

  router.afterEach(() => {
    checkJandFatalError()
  })

  const checkJandFatalError = async () => {
    if(router.currentRoute.value.path.startsWith('/error')) return
    userClient.getAllProcess().catch(e => {
      if(e instanceof FatalError) {
        router.replace('error')
      }
    })
  }

  checkJandFatalError()
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
    <RouterView></RouterView>
  </div>
</template>

<style>

.material-icons {
    vertical-align: bottom;
}

</style>
