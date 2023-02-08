<script>
import Card from '../Common/Card.vue';

export default {
  name: 'Process',
  components: {
    Card
  },
  props: [
    'process',
    'mode'
  ],
  data() {
    return {
      color: 'none'
    }
  },
  updated() {
    this.initialize()
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      this.determineColor()
      //strip directory from filename
      this.process.Filename = this.process.Filename.replace(this.process.WorkingDirectory, '')
    },
    determineColor() {
      this.process.Running ? this.$data.color = 'green' : this.$data.color = 'red'
    },
    onClicked() {
      this.$router.push(`/process/${this.process.Name}/dashboard`)
    }
  },
  watch: {
    mode: function () {
      this.initialize()
    }
  }
}
</script>
<template>
    <tr class="process process-list" @click="onClicked" v-if="mode == 'list'">
        <td :style="`background-color: ${color}`">
        </td>
        <td>
          {{ process.SafeIndex }}
        </td>
        <td>
          <b>{{ process.Name }}</b>
          <code class="code">
            <b>
              {{ process.Filename }}
            </b>
          </code>
        </td>
        <td>
          {{ process.ProcessId }}
        </td>
        <td>
          {{ process.RestartCount }}
        </td>
        <td>
          <span class="material-icons" :style="`color: ${process.AutoRestart ? 'green' : 'red'}`">
            {{ process.AutoRestart ? 'done' : 'dangerous' }}
          </span>
        </td>
        <td>
          <span class="material-icons" :style="`color: ${process.Enabled ? 'green' : 'red'}`">
            {{ process.Enabled ? 'done' : 'dangerous' }}
          </span>
        </td>
      </tr>
  <Card background :color="color" class="process" @click="onClicked" v-else>
    <template #header>
      {{ process.SafeIndex }}
      <b>{{ process.Name }}</b>
      <code class="code">
        {{ process.Filename }}
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

.process-list {
  transition: border-color 0.2s, background-color 0.2s;
  padding: 0;
  padding-left: 0.5em;
  margin: 0;
  filter: none;
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

/* List grid defined in ProcessListComponent */

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