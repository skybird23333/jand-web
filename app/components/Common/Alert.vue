<template>
    <div :class="type || 'alert'">
        <p>
            <slot></slot>
        </p>
    </div>
</template>

<script>
export default {
    name: 'Alert',
    props: {
        type: {
            validator(value) {
                // The value must match one of these strings
                return ['quote', 'alert', 'info', 'warn', 'success', 'error'].includes(value)
            }
        }
    },
};
</script>

<style>
</style>