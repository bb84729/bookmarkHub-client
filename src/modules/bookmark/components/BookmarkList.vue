<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { Pencil, Trash2, GripVertical } from 'lucide-vue-next'
import type { Bookmark } from '@/types'

const props = defineProps<{
  bookmarks: Bookmark[]
  getFolderName: (folderId: string | undefined) => string | null
}>()

const emit = defineEmits<{
  edit: [bookmark: Bookmark]
  delete: [id: string]
  reorder: [bookmarks: Bookmark[]]
}>()

// 用 computed + getter/setter 處理 v-model
const localBookmarks = computed({
  get: () => props.bookmarks,
  set: (value: Bookmark[]) => emit('reorder', value),
})

// 取得 favicon URL
const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return null
  }
}
</script>

<template>
  <draggable
    v-model="localBookmarks"
    item-key="_id"
    handle=".drag-handle"
    ghost-class="opacity-50"
    class="space-y-4"
  >
    <template #item="{ element: bookmark }">
      <div
        class="bg-card p-4 rounded-lg shadow border border-border hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex gap-3 flex-1 min-w-0">
            <!-- Drag handle -->
            <div
              class="drag-handle cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-1"
            >
              <GripVertical class="size-5" />
            </div>
            <!-- Favicon -->
            <img
              v-if="getFaviconUrl(bookmark.url)"
              :src="getFaviconUrl(bookmark.url)!"
              alt=""
              class="size-6 mt-1 rounded flex-shrink-0"
              loading="lazy"
            />
            <div class="flex-1 min-w-0">
              <a
                :href="bookmark.url"
                target="_blank"
                class="text-lg font-semibold text-primary hover:underline"
              >
                {{ bookmark.title }}
              </a>
              <p v-if="bookmark.description" class="text-muted-foreground mt-1">
                {{ bookmark.description }}
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <!-- Folder badge -->
                <span
                  v-if="getFolderName(bookmark.folder)"
                  class="bg-primary/10 text-primary text-sm px-2 py-1 rounded"
                >
                  📁 {{ getFolderName(bookmark.folder) }}
                </span>
                <!-- Tags -->
                <span
                  v-for="tag in bookmark.tags"
                  :key="tag"
                  class="bg-muted text-muted-foreground text-sm px-2 py-1 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="emit('edit', bookmark)"
              class="text-muted-foreground hover:text-primary"
              title="Edit"
            >
              <Pencil class="size-4" />
            </button>
            <button
              @click="emit('delete', bookmark._id)"
              class="text-muted-foreground hover:text-destructive"
              title="Delete"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>
