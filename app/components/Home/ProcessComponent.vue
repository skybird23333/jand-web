<script>
import Card from '../Common/Card.vue';

export default {
  name: 'Process',
  components: {
    Card
  },
  props: [
    'process'
  ],
  data() {
    return {
      color: 'blue'
    }
  },
  mounted() {
    this.determineColor()
  },
  methods: {
    determineColor() {
      this.process.Running ? this.$data.color = 'green' : this.$data.color = 'red'
    },
    onClicked() {
      this.$router.push(`/process/${this.process.Name}`)
    }
  }
}
</script>
<template>
  <Card background :color="color" class="process" @click="onClicked">

    <template #header>
      <b>{{ process.Name }}</b>
      <code class="code">
        {{ process.Filename }}
        {{ process.Arguments.join(' ') }}
      </code>
    </template>


    <div class="info-grid">
      <span class="working-directory">
        {{ process.WorkingDirectory }}
      </span>
      <div style="display: block;">
        <span class="label" v-if="process.ProcessId != -1">
          PID {{ process.ProcessId }}
        </span>
        <span class="label" v-if="!process.AutoRestart">
          Auto restart OFF
        </span>
        <span class="label" v-if="!process.Enabled">
          Disabled
        </span>
        <span class="label">
          {{ process.RestartCount }} restarts
        </span>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.process {
  transition: border-color 0.2s, background-color 0.2s;
  filter: drop-shadow(1px 1px 8px black);
}

.process:hover {
  background-color: var(--background-tertiary);
  border-color: var(--foreground-primary);
  filter: drop-shadow(3px 3px 8px black);
  cursor: pointer;
}

.code {
  background-color: var(--background-primary);
  margin: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: auto max-content;
}

.working-directory {
  font-size: small;
  font-weight: normal;
}

@media only screen and (max-width: 600px) {
  .info-grid {
    grid-template-columns: max-content;
  }

  .working-directory {
    display: none
  }
}
</style>