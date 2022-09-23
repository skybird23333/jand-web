<script>
import Card from '../Common/Card.vue';
export default {
    name: 'Process',
    components: {
        Card
    },
    props: [
        'process'
    ]
}
</script>
<template>
    <Card background color="green">

        <span>
            <b>{{ process.Name }}</b>
            <span v-if="process.Running" class="tag success">Running</span>
            <span v-else class="tag error">Stopped</span>

            <div class="card-footer" style="font-size: small; font-weight: normal;">
                {{ process.WorkingDirectory }}
                <code class="code">
                    {{ process.Filename }}
                    {{ process.Arguments.join(' ') }}</code>
            </div>
        </span>

        <div style="display:grid; grid-template-columns: auto max-content;">
            <div style="display: block; margin-top: 10px">
                <span class="label">
                    Auto restart {{ process.AutoRestart ? 'enabled' : 'disabled' }}
                </span>
                <span class="label">
                    Restarted {{ process.RestartCount }} times
                </span>
                <span class="label">
                    PID {{ process.ProcessId }}
                </span>
            </div>
            <div>
                <div class="button primary">Restart</div>
                <div class="button danger">Stop</div>
            </div>
        </div>
    </Card>
</template>
