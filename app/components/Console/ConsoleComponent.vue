<template>
  <Card background>
    <div class="logview" ref="logview">
      <ConsoleLineComponent v-for="line in lines" :type="line.type" :key="line.text">{{ line.text }}</ConsoleLineComponent>
    </div>
    <InputComponent placeholder="Send something to stdin..." v-model="input" @keydown="handleSend"></InputComponent>
  </Card>
</template>

<script>
import ConsoleLineComponent from "./ConsoleLineComponent.vue";
import Card from "../Common/Card.vue";
import InputComponent from "../Common/InputComponent.vue";

export default {
  name: "ConsoleComponent",
  components: { ConsoleLineComponent, Card, InputComponent },
  data() {
    return {
      lines: [
        {
          type: "stdout",
          text: "Compiling...",
        },
        {
          type: "stdout",
          text: "Ready! App is listening on localhost:3000",
        },
        {
          type: "stdin",
          text: "help",
        },
        {
          type: "stderr",
          text: "ERR: Cmd not found",
        },
      ],
      input: ""
    }
  },
  methods: {
    handleSend(evt) {
      if (evt.keyCode !== 13) return
      if (this.input === "") return;
      this.pushLog({
        type: "stdin",
        text: this.input,
      });
      this.input = "";
    },
    pushLog(log) {
      this.lines.push(log);
      this.$nextTick(() => {
        this.$refs.logview.scrollTop = this.$refs.logview.scrollHeight;
      });
      //TODO: send log to server
    }
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