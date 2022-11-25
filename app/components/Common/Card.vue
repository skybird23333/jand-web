<template>
    <div class="card" :class="[{background: background, border: border}, colorClass]">
        <div class="card-header">
            <slot name="header"></slot>
        </div>
        
        <slot></slot>
        
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    data() {
        return {
            colorClass: false
        }
    },
    props: {
        background: Boolean,
        border: Boolean,
        color: String,
    },
    updated() {
        this.colorClass = `color-${this.color}`
    },
    mounted() {
        this.colorClass = `color-${this.color}`
    }
};
</script>

<style scoped>
    .card-header {
        margin-bottom: 0;
    }
</style>