<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import ConsoleComponent from "../components/Console/ConsoleComponent.vue";
import Card from '../components/Common/Card.vue';
import Card1 from '../components/Common/Card.vue';
import Button from '../components/Common/Button.vue';
import Loading from '../components/Common/Loading.vue';
import Convert from 'ansi-to-html'
import userClient from '../http/userClient';

export default {
  name: 'ProcessView',
  components: {
    ConsoleComponent,
    ContentHead,
    ContentMain,
    ProcessComponent,
    Card,
    Card1,
    Button,
    Loading
  },
  data() {
    return {
      process: {
        Running: false,
        Filename: '',
        Arguments: []
      },
      loading: false,
      status: 'none',
      stream: null
    }
  },
  async mounted() {
    await this.syncProcessInfo()
    this.status = this.process.Running ? 'running' : 'stopped'
    this.stream = userClient.startLogStream(this.process.Name)
    const convert = new Convert()
    this.stream.onmessage = (e) => { //TODO: refactor into own component
      try {
        const data = JSON.parse(e.data)
        switch (data.type) {
          case 'stdout':
            this.$refs.console.append(convert.toHtml(data.data), data.type)
            break;
          case 'stderr':
            this.$refs.console.append(convert.toHtml(data.data), data.type)
            break;
          case 'procstart':
            this.$refs.console.append(`<div><span class="material-icons">directions_run</span>The process has been started</div>`, data.type)
            break;
          case 'procstop':
            this.$refs.console.append(`<div><span class="material-icons">close</span>The process has been stopped</div>`, data.type)
            break;
          default:
            this.$refs.console.append(`<div><span class="material-icons">event</span>${data.type}</div>`, data.type)
            break;
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  methods: {
    async syncProcessInfo() {
      //strip the path from the filename
      await userClient.getProcess(this.$route.params.name).then((process) => {
        this.process = process;
        this.process.Filename = this.process.Filename.replace(this.process.WorkingDirectory, '')
      });
    },

    restartProcess() {
      this.loading = true;
      this.status = 'starting'
      userClient.restartProcess(this.$route.params.name).then(() => {
        this.syncProcessInfo()
        this.$notify({
          title: "Restarting process",
          text: "Verifying process is running",
          type: 'info',
        })
        setTimeout(async () => {
          await this.syncProcessInfo()
          this.status = this.process.Running ? 'running' : 'stopped'
          if (this.process.Running) {
            this.$notify({
              title: "Restart successful",
              text: "Process restarted successfully",
              type: 'success'
            })
          } else {
            this.$notify({
              title: "Restart failed",
              text: "Process was unable to restart",
              type: 'error'
            })
          }
          this.loading = false;
        }, 2000);
      }).catch(() => {
        this.$notify({
          title: "Restart failed",
          text: "An error occured",
          type: 'error'
        })
        this.loading = false;
        this.status = 'stopped'
      })
    },

    stopProcess() {
      this.loading = true;
      userClient.stopProcess(this.$route.params.name).then(() => {
        this.syncProcessInfo()
        this.status = 'stopped'
        this.loading = false;
        this.$notify({
          title: "Process stopped",
          text: "Process stopped successfully",
          type: 'success'
        })
      });
    },
  }
}
</script>

<template>
  <div>
    <ContentHead :class="this.status">
      <div class="header-grid">
        <h2>
          {{ process.Name }}
          <Loading v-if="this.loading"></Loading>
        </h2>
        <div>
          <Button type="primary" @click="restartProcess()" :disabled="this.loading">{{ process.Running ? 're' : ''
          }}start</Button>
          <Button type="danger" @click="stopProcess()" :disabled="!process.Running || this.loading">stop</Button>
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
      <b>Console</b>
      <ConsoleComponent ref="console" :name="process.Name"></ConsoleComponent>
    </ContentMain>
  </div>
</template>

<style scoped>
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