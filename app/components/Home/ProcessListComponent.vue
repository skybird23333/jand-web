<template>
    <Tab :data="['card', 'list']" default="list" v-model="options.mode"></Tab>
    <div v-if="options.mode == 'list'">
        <div class="list-header">
            <span class="material-icons">storage</span>
            <b>
                {{ systemData.sysInfo.username }}@{{ systemData.sysInfo.hostname }}
            </b>
            JanD {{ systemData.daemon.Version }}
        </div>
        <table class="list-table">
            <tr>
                <th>
                </th>
                <th style="width: 20px">
                    ID
                </th>
                <th style="width: max-content">
                    Name
                </th>
                <th>
                    PID
                </th>
                <th>
                    <span class="material-icons">
                        restart_alt
                    </span>
                </th>
                <th>
                    A
                    <span class="material-icons">
                        autorenew
                    </span>
                </th>
                <th>
                    <span class="material-icons">
                        rocket_launch
                    </span>
                </th>
            </tr>
            <ProcessComponent v-for="process in processData" :key="process.id" :process="process"
                :mode="options.mode" />
        </table>
    </div>
    <div v-else>
        <div style="border-bottom: 1px solid var(--foreground-border)">
            <span class="material-icons">storage</span>
            <b>
                {{ systemData.sysInfo.username }}@{{ systemData.sysInfo.hostname }} | {{ systemData.daemon.Version }}
            </b>
        </div>
        <ProcessComponent v-for="process in processData" :key="process.id" :process="process" :mode="options.mode" />
    </div>
</template>

<script>
import Card from '../Common/Card.vue';
import Tab from '../Common/Tab.vue';
import ProcessComponent from './ProcessComponent.vue';

export default {
    name: "ProcessListComponent",
    props: {
        processes: {
            type: Array,
            required: true
        },
        systemData: {
            type: Object,
            required: true
        },
    },
    data: () => ({
        options: {
            mode: 'list' //card or list
        },
        processData: [],
    }),
    watch: {
        processes() {
            this.sort()
        }
    },
    mounted() {
        this.sort()
    },
    methods: {
        sort() {
            this.processData = this.processes.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
        }
    },
    components: { ProcessComponent, Card, Tab }
}
</script>

<style>
.list-header {
    padding: 10px;
    border: none;
    padding-left: 0.5em;
    background: var(--background-tertiary);
    margin-top: 20px;
    border: 1px solid var(--foreground-border);
    border-radius: 5px 5px 0 0;
    border-bottom: none;
}

.list-table {
    border: 1px solid var(--foreground-border);
    border-top: none;
    border-bottom: 1px solid var(--foreground-border);
    background: var(--background-tertiary);
    width: 100%;
    border-spacing: 0;
}

.list-table tr th {
    text-align: left;
}

.list-table tr td:first-child {
    width: 4px;
    padding:0;
}

.list-table tr td {
    border: none;
}   
</style>