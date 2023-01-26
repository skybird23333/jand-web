<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import Loading from '../components/Common/Loading.vue';
import Button from '../components/Common/Button.vue';
import Card from '../components/Common/Card.vue';
import Alert from '../components/Common/Alert.vue';
import ProcessListComponent from '../components/Home/ProcessListComponent.vue';
import userClient from '../http/userClient';

export default {
  name: 'HomeView',
  components: {
    ContentHead,
    ContentMain,
    ProcessComponent,
    Loading,
    Button,
    Card,
    Alert,
    ProcessListComponent
},
  data() {
    return {
      processes: [],
      loading: false,
      interval: 0,
      daemon: {
        Version: '',
        NotSaved: false,
      },
      sysInfo: {
        username: '',
        hostname: ''
      }
    }
  },
  mounted() {
    this.fetchProcesses();
    this.interval = setInterval(this.fetchProcesses, 5000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchProcesses() {
      this.loading = true;
      this.processes = await userClient.getAllProcess()
      this.daemon = await userClient.getDaemonStatus()
      this.sysInfo = await userClient.getSystemInfo()
      this.loading = false;
    },
    async onSave() {
      this.loading = true;
      await userClient.saveConfig()
      this.daemon.NotSaved = false;
      this.loading = false;
    }
  }
}
</script>

<template>
  <div>
    <ContentHead>
      <h2>
        All Processes
        <Loading v-if="loading"/>
        <Button type="confirm" style="float: right" @click="$router.push('/create')">
          New
        </Button>
      </h2>

      <Alert v-if="daemon.NotSaved" type="warn">
        Your process configuration list is unsaved. Changes made to it will be lost when you restart.
        <Button type="primary" @click="onSave">
          Save now
        </Button>
      </Alert>
    </ContentHead>
    <ContentMain>
      <ProcessListComponent :processes="processes" :systemData="{daemon, sysInfo}"></ProcessListComponent>
    </ContentMain>
  </div>
</template>
