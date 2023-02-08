<script setup>
import { inject, ref } from 'vue';
import ConsoleComponent from '../../components/Console/ConsoleComponent.vue';
import Convert from 'ansi-to-html'
import userClient from '../../http/userClient';

const consoleRef = ref(null);

const process = inject('process').value

console.log(consoleRef)

const stream = userClient.startLogStream(process.Name)
const convert = new Convert()
stream.onmessage = (e) => {
    try {
        const data = JSON.parse(e.data)
        switch (data.type) {
            case 'stdout':
                consoleRef.value.append(convert.toHtml(data.data), data.type)
                break;
            case 'stderr':
                consoleRef.value.append(convert.toHtml(data.data), data.type)
                break;
            case 'procstart':
                consoleRef.value.append(`<div><span class="material-icons">directions_run</span>The process has been started</div>`, data.type)
                break;
            case 'procstop':
                consoleRef.value.append(`<div><span class="material-icons">close</span>The process has been stopped</div>`, data.type)
                break;
            default:
                consoleRef.value.append(`<div><span class="material-icons">event</span>${data.type}</div>`, data.type)
                break;
        }
    } catch (e) {
        console.log(e)
    }
}
</script>

<template>
    <b>Console</b>
    <ConsoleComponent :name="process.name" ref="consoleRef"></ConsoleComponent>
</template>