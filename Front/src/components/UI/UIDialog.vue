<template>
    <div class="dialog" v-if="show === true" @click.stop="$emit('update:show', false)">
        <div @click.stop class="dialog__content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
    import { defineOptions, defineProps, defineEmits } from 'vue';

    defineOptions({
        name: 'ui-dialog'
    })

    const props = defineProps({
        show: {
            type: Boolean,
            default: true
        }
    })

    const emit = defineEmits(['update:show'])
</script>

<style scoped>
    .dialog {
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        display: flex;
    }

    .dialog__content {
        margin: auto;
        background: white;
        border-radius: 12px;
        min-height: 50px;
        min-width: 300px;
        padding: 20px;
    }
</style>