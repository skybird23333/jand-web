<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import Loading from '../components/Common/Loading.vue';

export default {
  name: 'HomeView',
  components: {
    ContentHead,
    ContentMain,
    ProcessComponent,
    Loading
},
  data() {
    return {
      processes: [],
      loading: false,
      interval: 0
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
      this.processes = await this.$client.getAllProcess()
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
      </h2>
    </ContentHead>
    <ContentMain>
      <ProcessComponent v-for="process in processes" :key="process.id" :process="process"/>
    </ContentMain>
  </div>
</template>
