<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmarks'
import type { Bookmark } from '@/types'
import { Pencil, X } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import BookmarkSearch from '@/modules/bookmark/components/BookmarkSearch.vue'
import BookmarkFormDialog from '@/modules/bookmark/components/BookmarkFormDialog.vue'

const router = useRouter()
const store = useBookmarkStore()

// Dialog state
const dialogOpen = ref(false)
const editingBookmark = ref<Bookmark | null>(null)

// Open create dialog
const openCreateDialog = () => {
  editingBookmark.value = null
  dialogOpen.value = true
}

// Open edit dialog
const openEditDialog = (bookmark: Bookmark) => {
  editingBookmark.value = bookmark
  dialogOpen.value = true
}

// Handle form submit (create or update)
const handleFormSubmit = async (data: {
  title: string
  url: string
  description: string
  tags: string[]
}) => {
  if (editingBookmark.value) {
    const result = await store.updateBookmark(editingBookmark.value._id, data)
    if (result) {
      dialogOpen.value = false
      editingBookmark.value = null
    }
  } else {
    const result = await store.createBookmark(data)
    if (result) {
      dialogOpen.value = false
    }
  }
}

// Delete bookmark
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this bookmark?')) {
    return
  }
  await store.deleteBookmark(id)
}

// Search bookmarks
const handleSearch = async (query: string) => {
  await store.searchBookmarks(query)
}

// Logout
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  store.fetchBookmarks()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <AppHeader :on-new-click="openCreateDialog" :on-logout="handleLogout" />

    <!-- Search -->
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <BookmarkSearch @search="handleSearch" />
    </div>

    <!-- Main -->
    <main class="max-w-5xl mx-auto px-4 py-8">
      <!-- Error -->
      <div v-if="store.error" class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {{ store.error }}
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="text-center text-gray-500">Loading...</div>

      <!-- No bookmarks -->
      <div v-else-if="store.bookmarks.length === 0" class="text-center text-gray-500">
        No bookmarks yet
      </div>

      <!-- Bookmark list -->
      <div v-else class="space-y-4">
        <div
          v-for="bookmark in store.bookmarks"
          :key="bookmark._id"
          class="bg-white p-4 rounded-lg shadow hover:shadow-md"
        >
          <div class="flex justify-between items-start">
            <div>
              <a
                :href="bookmark.url"
                target="_blank"
                class="text-lg font-semibold text-blue-600 hover:underline"
              >
                {{ bookmark.title }}
              </a>
              <p v-if="bookmark.description" class="text-gray-600 mt-1">
                {{ bookmark.description }}
              </p>
              <div v-if="bookmark.tags.length > 0" class="mt-2 flex gap-2">
                <span
                  v-for="tag in bookmark.tags"
                  :key="tag"
                  class="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="openEditDialog(bookmark)"
                class="text-gray-400 hover:text-blue-600"
                title="Edit"
              >
                <Pencil class="size-4" />
              </button>
              <button
                @click="handleDelete(bookmark._id)"
                class="text-gray-400 hover:text-red-600"
                title="Delete"
              >
                <X class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Form Dialog -->
    <BookmarkFormDialog
      v-model:open="dialogOpen"
      :bookmark="editingBookmark"
      @submit="handleFormSubmit"
    />
  </div>
</template>
