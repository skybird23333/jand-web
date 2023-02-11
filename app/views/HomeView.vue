<script>
import Content from '../components/Common/Content.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import Loading from '../components/Common/Loading.vue';
import Button from '../components/Common/Button.vue';
import Card from '../components/Common/Card.vue';
import Alert from '../components/Common/Alert.vue';
import ProcessListComponent from '../components/Home/ProcessListComponent.vue';
import userClient from '../http/userClient';
import Tab from '../components/Common/Tab.vue';

export default {
  name: 'HomeView',
  components: {
    Content,
    ProcessComponent,
    Loading,
    Button,
    Card,
    Alert,
    ProcessListComponent,
    Tab
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
      options: {
        mode: 'card' //card or list
      },
      sysInfo: {
        username: '',
        hostname: ''
      },
      hosts: [
        /**
         * system
         * daemon
         * processes
         */
      ]
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
      this.hosts = await userClient.getAllHosts();
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
  <Content>
    <template #header>
      <h2>
        All Processes
        <Loading v-if="loading" />
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
    </template>
    <template #content>
      <Tab :data="['card', 'list']" default="card" v-model="options.mode"></Tab>
      <ProcessListComponent
        v-for="host in hosts"
        :processes="host.processes"
        :systemData="{ daemon: host.daemon, sysInfo: host.system }"
        :options="options"
      ></ProcessListComponent>
    </template>
  </Content>
</template>
