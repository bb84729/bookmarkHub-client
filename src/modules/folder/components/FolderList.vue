<script setup lang="ts">
import { computed } from 'vue'
import { FolderIcon, Pencil, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { Folder } from '@/types'

const props = defineProps<{
  folders: Folder[]
  selectedFolderId: string | null
}>()

const emit = defineEmits<{
  select: [folderId: string | null]
  edit: [folder: Folder]
  delete: [folderId: string]
}>()

const isAllSelected = computed(() => props.selectedFolderId === null)
</script>

<template>
  <div class="space-y-1">
    <!-- All Bookmarks -->
    <button
      @click="emit('select', null)"
      class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors"
      :class="isAllSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'"
    >
      <FolderIcon class="size-4" />
      <span>All Bookmarks</span>
    </button>

    <!-- Folder list -->
    <div v-for="folder in folders" :key="folder._id" class="group flex items-center">
      <button
        @click="emit('select', folder._id)"
        class="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors"
        :class="
          selectedFolderId === folder._id
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-muted text-foreground'
        "
      >
        <FolderIcon class="size-4" />
        <span class="truncate">{{ folder.name }}</span>
      </button>

      <!-- Actions (visible on hover) -->
      <div class="hidden group-hover:flex items-center gap-1 pr-2">
        <Button variant="ghost" size="icon" class="size-7" @click.stop="emit('edit', folder)">
          <Pencil class="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="size-7 text-destructive hover:text-destructive"
          @click.stop="emit('delete', folder._id)"
        >
          <Trash2 class="size-3" />
        </Button>
      </div>
    </div>
  </div>
</template>
