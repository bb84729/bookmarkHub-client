<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const emit = defineEmits<{
  search: [query: string]
}>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="flex gap-2">
    <Input
      v-model="searchQuery"
      type="text"
      class="flex-1"
      placeholder="Search bookmarks..."
    />
    <Button type="submit">Search</Button>
  </form>
</template>
