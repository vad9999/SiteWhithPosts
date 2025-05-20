<template>
    <select
    class="select"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    >
    <option disabled value="">Выберите из списка</option>
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.name }}</option>
    </select>
</template>

<script setup>
    import { defineOptions, defineProps, defineEmits } from 'vue';

    defineOptions({
        name: 'ui-select'
    })

    const props = defineProps({
        modelValue: {
            type: String
        },
        options: {
            type: Array,
            default: () => []
        }
    })

    const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>

</style>