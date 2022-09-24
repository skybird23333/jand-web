<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import ConsoleComponent from "../components/Console/ConsoleComponent.vue";

export default {
  name: 'ProcessView',
  components: {
    ConsoleComponent,
    ContentHead,
    ContentMain,
    ProcessComponent
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {}
}
</script>

<template>
  <div>
    <ContentHead>
      <h2>
        My Application
      </h2>
    </ContentHead>
    <ContentMain>
      <b>Console</b>
      <ConsoleComponent></ConsoleComponent>
    </ContentMain>
  </div>
</template>
