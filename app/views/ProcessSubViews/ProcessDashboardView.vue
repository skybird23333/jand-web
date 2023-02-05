<script setup>
import { inject } from 'vue';
import Card from '../../components/Common/Card.vue';

const process = inject('process');

console.log(process.Filename)
</script>

<template>
          <b>Launch</b>
      <Card>
        <template #header>
          <div class="command">
            <b>
              {{ process.Filename }}
            </b>
            <code v-for="arg in process.Arguments" :key="arg">
                    <span>
                      {{ arg }}
                    </span>
                  </code>
          </div>
        </template>
        <template #footer>
          <span style="font-weight: normal">
            {{ process.WorkingDirectory }}
          </span>

        </template>
      </Card>
      <b>Status</b>
      <Card>
        <span class="label" v-if="process.ProcessId != -1">
          PID {{ process.ProcessId }}
        </span>
        <span class="label">
          {{ process.Enabled ? 'Enabled' : 'Disabled' }} at start
        </span>
        <span class="label">
          Auto restart {{ process.AutoRestart ? 'enabled' : 'disabled' }}
        </span>
        <span class="label">
          {{ process.RestartCount }} restarts
        </span>
      </Card>
</template>

<style>

.command b {
  margin-right: 10px;
  font-size: large;
}


.running {
  background: linear-gradient(rgba(0, 255, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
}

.starting {
  background: linear-gradient(rgba(0, 0, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
}

.stopped {
  background: linear-gradient(rgba(255, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
}

@keyframes background {
  0% {
    background-position: 50% 0%
  }

  50% {
    background-position: 51% 100%
  }

  100% {
    background-position: 50% 0%
  }
}

.running {
  background-size: 100% 130%;
  animation: background 5s ease infinite;
}

.command code {
  padding: 5px;
  border-radius: 4px;
  margin-right: 3px;
  border: 1px solid var(--foreground-border);
}

.header-grid {
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: 10px;
}

@media only screen and (max-width: 600px) {
  .header-grid {
    grid-template-columns: auto;
  }
}
</style>