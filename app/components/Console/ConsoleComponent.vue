<template>
  <Card background>
    <div class="logview" ref="logview">
      <ConsoleLineComponent v-for="line in lines" :type="line.type" :key="line.text" v-html="line.text"></ConsoleLineComponent>
    </div>
    <InputComponent placeholder="Send something to stdin..." v-model="input" @keydown="handleSend"></InputComponent>
  </Card>
</template>

<script>
import ConsoleLineComponent from "./ConsoleLineComponent.vue";
import Card from "../Common/Card.vue";
import InputComponent from "../Common/InputComponent.vue";
import userClient from '../../http/userClient'

export default {
  name: "ConsoleComponent",
  components: { ConsoleLineComponent, Card, InputComponent },
  props: [ 'name' ],
  data() {
    return {
      lines: [],
      input: ""
    }
  },
  methods: {
    append(line, type) {
      const isUserScrolledUp = !(this.$refs.logview.scrollTop + 200 == this.$refs.logview.scrollHeight)
      this.lines.push({ text: line, type: type });
      this.$nextTick(() => {
        if (!isUserScrolledUp) {
          this.$refs.logview.scrollTop = this.$refs.logview.scrollHeight;
        }
      });
    },
    async handleSend(evt) {
      if (evt.keyCode !== 13) return
      if (this.input === "") return;
      userClient.sendToProcessStdin(this.name, this.input);
      this.append(this.input, "stdin");
      this.input = "";
    },
  }
}
</script>

<style scoped>

.logview {
  overflow-y: auto;
  height: 200px;
}

.input {
  width: 100%;
  margin: 0;
  padding: none;
  box-sizing: border-box;
}
</style>