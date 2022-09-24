<template>
  <Transition appear>
    <div class="log" :class="this.type">
      <slot />
    </div>
  </Transition>
</template>

<script>
export default {
  name: "ConsoleLineComponent",
  props: [
    'type'
  ]
}
</script>

<style scoped>
.v-enter-active {
  transition: filter 3s, background-color 3s;
}

.v-enter-from {
  filter: brightness(500%);
}

.stdout.v-enter-from {
  background-color: rgba(255, 255, 255, 0.5)
}

.log {
  font-size: 16px;
  border-left: 3px solid white;
  padding-left: 5px;
  padding-top: 3px;
  font-family: 'Consolas', 'Courier New', Courier, monospace;
}

.stdin {
  border-color: #005DFF;
  background: linear-gradient(to right, rgba(0, 94, 255, 0.2), rgba(0, 94, 255, 0));
}

.stdout {
  border-color: #00FF00;
}

.stderr {
  border-color: #a10000;
  background: linear-gradient(to right, rgba(158, 0, 0, 0.2), rgba(0, 0, 0, 0));
}
</style>