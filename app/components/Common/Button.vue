<template>
    <button class="button" :class="type" :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: ['type', 'disabled'],
};
</script>

<style>
    .button {
        font-size: 15px;
        margin: 4px;
    }
</style>