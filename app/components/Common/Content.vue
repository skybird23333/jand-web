<script setup>
</script>

<template>
    <div class="content">
        <div class="content-header" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <slot></slot>
        <div class="content-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
