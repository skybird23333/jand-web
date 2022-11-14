<script>
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import Loading from '../components/Common/Loading.vue';
import InputComponent from '../components/Common/InputComponent.vue';
import Card from '../components/Common/Card.vue';
import Button from '../components/Common/Button.vue';
import { debounce } from 'lodash-es'

export default {
  name: 'CreateView',
  components: {
    ContentHead,
    ContentMain,
    ProcessComponent,
    Loading,
    InputComponent,
    Card,
    Button
  },
  data() {
    return {
      process: {
        Name: '',
        Filename: "",
        ArgumentsString: [],
        Arguments: [],
        WorkingDirectory: ""
      },
      giturl: '',
      targetpath: '',
      loading: false,
      checks: {
        writable: undefined,
        exists: undefined
      }
    }
  },
  mounted() {
  },
  methods: {
  },
  watch: {
    'process.ArgumentsString': function (args) {
      const argsRegex = /"[^"]+"|[^\s]+/g
      if (!args.match(argsRegex)) {
        this.process.Filename = ''
        this.process.Arguments = []
        return
      }
      const argsArray = args.match(argsRegex).map(e => e.replace(/"(.+)"/, "$1"));
      this.process.Filename = argsArray.shift()
      this.process.Arguments = argsArray
    },
    targetpath: debounce(async function () {
      if (!this.targetpath) return
      this.loading = true
      this.checks = (await this.$client.checkDirectoryWritable(this.targetpath))
      this.loading = false
    }, 500)

  },
}
</script>

<template>
  <div>
    <ContentHead>
      <h2>
        Create new
      </h2>
    </ContentHead>
    <ContentMain>
      <Card>
        <template #header>
          Launch options
        </template>
        <div>
          Name <InputComponent v-model="this.process.Name" placeholder="my-app"></InputComponent>
        </div>

        <div>
          Command <InputComponent v-model="this.process.ArgumentsString" placeholder="npm run start"></InputComponent>
        </div>

        Will be resolved as:

        <div class="command">
          {{ process.Filename }}
          <code v-for="arg in process.Arguments" :key="arg">
                  <span>
                    {{ arg }}
                  </span>
                </code>
        </div>
      </Card>

      <Card>
        <template #header>
          Use existing directory
        </template>
        <div>
          Working Directory <InputComponent v-model="this.targetpath" placeholder="/var/app">
          </InputComponent>
          <Button type="confirm">Create</Button>
          <Loading v-if="this.loading"></Loading>
          <div v-if="checks.exists">
            Directory exists
          </div>
          <div v-else>
            Directory doesn't exist
          </div>
        </div>
      </Card>

      <h2 style="text-align: center;">OR</h2>

      <Card>
        <template #header>
          Deploy from git url
        </template>
        <div>
          Git url <InputComponent v-model="this.process.giturl" placeholder="https://github.com/skybird23333/jand-web">
          </InputComponent>
          Target folder <InputComponent v-model="this.targetpath" placeholder="/home/username/jand-apps">
          </InputComponent>
          <Loading v-if="this.loading"></Loading>
          <div v-if="checks.writable">
            Directory writable
          </div>
          <div v-else>
            Directory not writable
          </div>
          <div v-if="checks.exists">
            Directory exists
          </div>
          <div v-else>
            Directory doesn't exist
            <div v-if="checks.parentWritable">
              Directory has a writable parent(will be created)
            </div>
            <div v-else>
              No writable parent
            </div>
          </div>
          <Button type="confirm">Clone and deploy</Button>
        </div>
      </Card>

    </ContentMain>
  </div>
</template>

<style scoped>
.command code {
  padding: 5px;
  border-radius: 4px;
  margin-right: 3px;
  border: 1px solid var(--foreground-border);
}
</style>