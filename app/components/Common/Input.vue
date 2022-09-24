<template>
    <input class="input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder" :type="type" :disabled="disabled" :required="required">
</template>

<script>
export default {
    name: 'Input',
    props: ['modelValue', 'placeholder', 'type', 'disabled', 'required'],
    emits: ['update:modelValue'],
};
</script>