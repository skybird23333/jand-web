<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import ConsoleComponent from "../components/Console/ConsoleComponent.vue";
import Card from '../components/Common/Card.vue';
import Card1 from '../components/Common/Card.vue';
import Button from '../components/Common/Button.vue';
import { restartProcess } from 'jand-ipc';

export default {
  name: 'ProcessView',
  components: {
    ConsoleComponent,
    ContentHead,
    ContentMain,
    ProcessComponent,
    Card,
    Card1,
    Button
  },
  data() {
    return {
      process: {
        Running: false,
        Filename: '',
        Arguments: []
      },
    }
  },
  mounted() {
    this.syncProcessInfo()
  },
  methods: {
    syncProcessInfo() {
      //strip the path from the filename
      this.$client.getProcess(this.$route.params.name).then((process) => {
        this.process = process;
        this.process.Filename = this.process.Filename.replace(this.process.WorkingDirectory, '')
      });
    },

    restartProcess() {
      this.$client.restartProcess(this.$route.params.name).then(() => {
        this.syncProcessInfo()
      });
    },
    stopProcess() {
      this.$client.stopProcess(this.$route.params.name).then(() => {
        this.syncProcessInfo()
      });
    },
  }
}
</script>

<template>
  <div>
    <ContentHead :class="this.process.Running ? 'running' : 'stopped'">
      <div class="header-grid">
        <h2>
          {{ process.Name }}
        </h2>
        <div>
          <Button type="primary" @click="restartProcess()">{{ process.Running ? 're' : '' }}start</Button>
          <Button type="danger" @click="stopProcess()" :disabled="!process.Running">stop</Button>
        </div>
      </div>
    </ContentHead>
    <ContentMain>
      <b>Launch</b>
      <Card>
        <template #header>
          <div class="command">
            <b>
              {{ process.Filename }}
            </b>
            <code>
                <span v-for="arg in process.Arguments" :key="arg">
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
      <b>Console</b>
      <ConsoleComponent></ConsoleComponent>
    </ContentMain>
  </div>
</template>

<style>
.command b {
  margin-right: 10px;
  font-size: large;
}


.running {
  background: linear-gradient(rgba(0, 255, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
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
.command code span {
  background: var(--background-tertiary);
  padding: 5px;
  border-radius: 4px;
  margin-right: 3px;
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