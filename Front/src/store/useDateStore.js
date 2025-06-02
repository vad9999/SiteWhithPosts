import { defineStore } from "pinia";
import dayjs from 'dayjs'

export const useDateStore = defineStore('date', {
    actions: {
        formatDate (date) {
            return dayjs(date).format('DD.MM.YYYY HH:mm')
        } 
    }
})