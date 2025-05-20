<template>
    <input
    class="input"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    />
</template>

<script setup>
    import { defineOptions, defineProps } from 'vue';

    defineOptions({
        name: 'ui-input'
    })

    const props = defineProps({
        modelValue: [String, Number],
        type: {
            type: String,
            default: 'text'
        }
    })

    const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
    .input {
        width: 100%;
        border: 1px solid teal;
        padding: 10px 15px;
        margin-top: 15px;
    }
</style>