<template>
    <div class="tab-container">
        <span v-for="item in data" :key="item" @click="setActive(item)" class="tab-item" :class="{'tab-active': (active == item)}">
            {{item}}
        </span>
    </div>
</template>

<script>
export default {
    name: 'Tab',
    props: {
        data: {
            type: Array,
            required: true
        },
        default: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue'],
    data: function () {
        return {
            active: null
        }
    },
    methods: {
        setActive: function (item) {
            this.active = item
            this.$emit('update:modelValue', item)
        }
    },
    mounted: function () {
        this.active = this.default
    },
}
</script>

<style scoped>
.tab-container {
    width: max-content;
    border: 1px solid var(--foreground-border);
    background-color: var(--background-primary);
    border-radius: 5px;
    padding-top: 3px;
    padding-bottom: 3px;
}

.tab-item:first-child {
    border-radius: 5px 0 0 5px;
}

.tab-item:last-child {
    border-radius: 0 5px 5px 0;
}

.tab-item {
    transition: all 0.4s;
    padding: 3px 7px;
}

.tab-item:hover {
    background-color: var(--background-tertiary);
    cursor: pointer;
}

.tab-active {
    background-color: var(--foreground-primary);
    box-sizing: content-box;
    color: var(--background-tertiary);
    font-weight: bold;
}

.tab-active:hover {
    background-color: var(--foreground-primary);
    cursor: default;
}
</style>