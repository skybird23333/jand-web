<template>
  <notifications position="right">
    <template #body="props">
      <div class="my-notification" :class="props.item.type">
        <div class="title">
          {{ props.item.title }}
        </div>
        <div v-html="props.item.text" />
      </div>
    </template>
  </notifications>
</template>

<style>
  .my-notification {
    background-color: var(--background-secondary);
    border: 1px solid var(--foreground-border);
    border-left: 5px solid var(--foreground-primary);
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .vue-notification-group {
    margin-top: 70px;
  }

  @media only screen and (max-width: 600px) {
    .vue-notification-group {
      margin-top: 0;
      margin-bottom: 40px;
      bottom: 0px;
      top: auto;
    }
  }

  .my-notification .title {
    font-weight: bold;
    margin: 0;
  }

  .my-notification.info {
    border-left-color: var(--blue);
  }
  .my-notification.success {
    border-left-color: var(--green);
  }
  .my-notification.warn {
    border-left-color: var(--yellow);
  }
  .my-notification.error {
    border-left-color: var(--red);
  }
</style>