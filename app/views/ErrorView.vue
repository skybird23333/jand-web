
import JandConnectError from '../components/Errors/JandConnectError.vue';

<template>
    <div style="text-align: center">
        <ContentHead>
            <h1>
                Fatal Error
            </h1>
            Jand-web was not able to connect to the JanD daemon.
        </ContentHead>
        <ContentMain>
            <JandConnectError></JandConnectError>
        </ContentMain>
    </div>
</template>