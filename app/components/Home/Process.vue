<template>
    <Card background color="green">

        <span>
            <b>My app</b>
            <span class="tag success">Running</span>

            <div class="card-footer" style="font-size: small; font-weight: normal;">
                wd/<code class="code">command</code>
            </div>
        </span>

        <div style="display:grid; grid-template-columns: auto max-content;">
            <div style="display: block; margin-top: 10px">
                <span class="label">
                    Auto restart TODO
                </span>
                <span class="label">
                    Restarted TODO times
                </span>
                <span class="label">
                    PID TODO
                </span>
            </div>
            <div>
                <div class="button primary">Restart</div>
                <div class="button danger">Stop</div>
            </div>
        </div>
    </Card>
</template>

<script setup>
import Card from '../Common/Card.vue';
</script>