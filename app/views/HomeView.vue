<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';

export default {
  name: 'Home',
  components: {
    ContentHead,
    ContentMain,
    ProcessComponent
  },
  data() {
    return {
      processes: []
    }
  },
  mounted() {
    this.fetchProcesses();
  },
  methods: {
    async fetchProcesses() {
      this.processes = await this.$client.getAllProcess()
    }
  }
}
</script>

<template>
  <div>
    <ContentHead>
      <h2>
        All Processes
      </h2>
    </ContentHead>
    <ContentMain>
      <ProcessComponent v-for="process in processes" :key="process.id" :process="process" />
    </ContentMain>
  </div>
</template>
