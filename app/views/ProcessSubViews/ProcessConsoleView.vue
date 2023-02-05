<script setup>
import { inject, ref } from 'vue';
import ConsoleComponent from '../../components/Console/ConsoleComponent.vue';
import Convert from 'ansi-to-html'
import userClient from '../../http/userClient';

const consoleRef = ref(null);

const process = inject('process');

const stream = userClient.startLogStream(process.Name)
const convert = new Convert()
stream.onmessage = (e) => { //TODO: refactor into own component
    try {
        const data = JSON.parse(e.data)
        switch (data.type) {
            case 'stdout':
                consoleRef.append(convert.toHtml(data.data), data.type)
                break;
            case 'stderr':
                consoleRef.append(convert.toHtml(data.data), data.type)
                break;
            case 'procstart':
                consoleRef.append(`<div><span class="material-icons">directions_run</span>The process has been started</div>`, data.type)
                break;
            case 'procstop':
                consoleRef.append(`<div><span class="material-icons">close</span>The process has been stopped</div>`, data.type)
                break;
            default:
                consoleRef.append(`<div><span class="material-icons">event</span>${data.type}</div>`, data.type)
                break;
        }
    } catch (e) {
        consoleRef.log(e)
    }
}
</script>

<template>
    <b>Console</b>
    <ConsoleComponent :name="process.name" ref="consoleRef"></ConsoleComponent>
</template>