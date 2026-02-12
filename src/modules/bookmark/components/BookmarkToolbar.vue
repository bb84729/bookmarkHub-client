<script setup lang="ts">
import { Upload, Download, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  create: []
  import: []
  export: []
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-foreground">Bookmarks</h2>
    <div class="flex items-center gap-2">
      <Button @click="$emit('create')">
        <Plus class="size-4 mr-1" />
        New
      </Button>
      <Button variant="outline" size="icon" @click="$emit('import')" title="Import">
        <Upload class="size-4" />
      </Button>
      <Button variant="outline" size="icon" @click="$emit('export')" title="Export">
        <Download class="size-4" />
      </Button>
    </div>
  </div>
</template>
