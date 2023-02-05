<script>
import Content from '../components/Common/Content.vue';
import ContentHead from '../components/Layout/ContentHead.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import ConsoleComponent from "../components/Console/ConsoleComponent.vue";
import Sidebar from '../components/Layout/Sidebar.vue';
import Card from '../components/Common/Card.vue';
import Button from '../components/Common/Button.vue';
import Loading from '../components/Common/Loading.vue';
import userClient from '../http/userClient';
import { computed } from 'vue'

export default {
  name: 'ProcessView',
  components: {
    ConsoleComponent,
    Content,
    Sidebar,
    ContentHead,
    ProcessComponent,
    Card,
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
    if(this.$route.path.endsWith(this.process.Name)) {
      this.$router.push({path: this.$route.path + '/dashboard'})
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
  },
  provide() {
    return {
      process: computed(() => this.process)
    }
  }
}
</script>

<template>

  <Sidebar>
    <RouterLink to="/">
      <span class="material-icons">arrow_back</span>
      <span>Back</span>
    </RouterLink>
    <RouterLink :to="`/process/${ process.Name }/dashboard`">
      <span class="material-icons">dashboard</span>
      <span>Dashboard</span>
    </RouterLink>
    <RouterLink :to="`/process/${ process.Name }/console`">
      <span class="material-icons">terminal</span>
      <span>Console</span>
    </RouterLink>
  </Sidebar>
  <Content>
    <ContentHead :class="this.status" style="z-index: 2; position: relative;">
      <div class="header-grid">
        <h2>
          {{ process.Name }}
          <Loading v-if="this.loading"></Loading>
        </h2>
        <div>
          <Button type="primary" @click="restartProcess()" :disabled="this.loading">{{
            process.Running ? 're' : ''
          }}start</Button>
          <Button type="danger" @click="stopProcess()" :disabled="!process.Running || this.loading">stop</Button>
        </div>
      </div>
    </ContentHead>
    <template #content>
      <RouterView></RouterView>
    </template>
  </Content>
</template>

<style scoped>
.material-icons {
  vertical-align: middle;
}

.router-link-active {
  font-weight: bolder;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.1));
  border-right: 2px solid var(--foreground-primary);
}
</style>