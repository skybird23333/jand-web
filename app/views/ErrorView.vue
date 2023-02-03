<script setup>
import JandConnectError from '../components/Errors/JandConnectError.vue';
import ContentHead from '../components/Common/ContentHead.vue';
import ContentMain from '../components/Common/ContentMain.vue';

const message = "Jand-web was not able to connect to the JanD daemon." //TODO:
</script>

<template>
    <ContentHead class="error-header">
        <h1>
            Fatal Error
        </h1>
        {{ message }}
    </ContentHead>
    <ContentMain>
        <JandConnectError ref="error"></JandConnectError>
        <div class="info">
            <p>
                Once you resolve the above issue, you need to restart the jand-web server for it to function again.
            </p>
        </div>
    </ContentMain>
</template>

<style scoped>
.error-header {
    background: linear-gradient(rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0) 100%);
    text-align: center
}
</style>