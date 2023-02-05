<script>
import Content from '../components/Common/Content.vue';
import ProcessComponent from '../components/Home/ProcessComponent.vue';
import Loading from '../components/Common/Loading.vue';
import InputComponent from '../components/Common/InputComponent.vue';
import Card from '../components/Common/Card.vue';
import Button from '../components/Common/Button.vue';
import { debounce } from 'lodash-es'
import CreatePresetsComponent from '../components/Create/CreatePresetsComponent.vue';
import ComingSoon from '../components/Common/ComingSoon.vue';
import presets from '../data/processCreatePresets'
import userClient from '../http/userClient';

export default {
  name: 'CreateView',
  components: {
    Content,
    ProcessComponent,
    Loading,
    InputComponent,
    Card,
    Button,
    CreatePresetsComponent,
    ComingSoon
  },
  data() {
    return {
      presets: presets,
      //Default fields unless overriden by presets.
      process: {
        Name: '',
        Filename: "",
        ArgumentsString: [],
        Arguments: [],
        WorkingDirectory: ""
      },
      options: {}, // This is a dynamic field to be provided by the presets.
      giturl: '',
      targetpath: '',
      loading: false,
      checks: {
        writable: undefined,
        exists: undefined
      },
      step: 0,
      createPreset: {

      }
    }
  },
  async mounted() {
    this.sysInfo = await this.$client.getSystemInfo()
    //TODO: Cross platform, maybe let server return a resolved path of home directory
    this.process.WorkingDirectory = `/home/${this.sysInfo.username}/.jand-apps`
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
    'process.WorkingDirectory': debounce(async function () {
      if (!this.process.WorkingDirectory) return
      this.loading = true
      this.checks = (await userClient.checkDirectoryWritable(this.targetpath))
      this.loading = false
    }, 500)

  },
}
</script>

<template>
  <Content>
    <template #header>
      <h2>
        Create new
      </h2>
    </template>
    <template #content>
      <div v-if="(step == 0)">
        <CreatePresetsComponent title="Use existing directory"
          description="Create a process on an existing directory on the machine." icon="folder">
        </CreatePresetsComponent>
        <ComingSoon>
          <CreatePresetsComponent title="Deploy from git url"
            description="Clone from a git url and start running the app." icon="get_app"></CreatePresetsComponent>
        </ComingSoon>
        <ComingSoon>
          <CreatePresetsComponent title="One-time job"
            description="Create a job process that won't be auto restarted, for example, building an app. You will be able to see its progress."
            icon="work"></CreatePresetsComponent>
        </ComingSoon>
      </div>

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
          Working Directory <InputComponent v-model="process.WorkingDirectory" placeholder="/var/app">
          </InputComponent>
          <Button type="confirm">Create</Button>
          <Loading v-if="this.loading"></Loading>
          <div v-if="checks.exists">
            <span class="material-icons">
              done
            </span>
            Existing directory
          </div>
          <div v-else>
            <span class="material-icons">
              warning
            </span>
            Directory doesn't exist
            <div v-if="checks.parentWritable">
              <span class="material-icons">
                done
              </span>
              Directory can be created
            </div>
            <div v-else>
              <span class="material-icons">
                warning
              </span>
              Directory cannot be created
            </div>
          </div>
        </div>
      </Card>

      <h2 style="text-align: center;">OR</h2>
      <!-- 
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
      </Card> -->
    </template>
  </Content>
</template>

<style scoped>
.command code {
  padding: 5px;
  border-radius: 4px;
  margin-right: 3px;
  border: 1px solid var(--foreground-border);
}
</style>