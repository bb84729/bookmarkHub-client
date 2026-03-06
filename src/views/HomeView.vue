<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmarks'
import { useFolderStore } from '@/stores/folders'
import type { Bookmark, Folder } from '@/types'
import { FolderPlus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AppHeader from '@/components/AppHeader.vue'
import BookmarkSearch from '@/modules/bookmark/components/BookmarkSearch.vue'
import BookmarkToolbar from '@/modules/bookmark/components/BookmarkToolbar.vue'
import BookmarkList from '@/modules/bookmark/components/BookmarkList.vue'
import BookmarkFormDialog from '@/modules/bookmark/components/BookmarkFormDialog.vue'
import FolderList from '@/modules/folder/components/FolderList.vue'
import FolderFormDialog from '@/modules/folder/components/FolderFormDialog.vue'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'

const router = useRouter()
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()

// Bookmark dialog state
const bookmarkDialogOpen = ref(false)
const editingBookmark = ref<Bookmark | null>(null)

// Folder dialog state
const folderDialogOpen = ref(false)
const editingFolder = ref<Folder | null>(null)

// Delete dialog state
const deleteDialogOpen = ref(false)
const deleteTarget = ref<{ type: 'bookmark' | 'folder'; id: string } | null>(null)

// Selected folder filter
const selectedFolderId = ref<string | null>(null)

// Import/Export
const fileInputRef = ref<HTMLInputElement | null>(null)

// Filtered bookmarks based on selected folder
const filteredBookmarks = computed(() => {
  if (selectedFolderId.value === null) {
    return bookmarkStore.bookmarks
  }
  return bookmarkStore.bookmarks.filter((b) => b.folder === selectedFolderId.value)
})

// Get folder name by id
const getFolderName = (folderId: string | undefined) => {
  if (!folderId) return null
  const folder = folderStore.folders.find((f) => f._id === folderId)
  return folder?.name || null
}

// Handle drag reorder
const handleReorder = async (reorderedBookmarks: Bookmark[]) => {
  // 更新本地順序
  bookmarkStore.bookmarks = reorderedBookmarks

  // 準備 API 資料
  const items = reorderedBookmarks.map((b, index) => ({
    id: b._id,
    order: index,
  }))

  // 呼叫 API 儲存
  await bookmarkStore.updateOrder(items)
}

// Bookmark actions
const openCreateBookmarkDialog = () => {
  editingBookmark.value = null
  bookmarkDialogOpen.value = true
}

const openEditBookmarkDialog = (bookmark: Bookmark) => {
  editingBookmark.value = bookmark
  bookmarkDialogOpen.value = true
}

const handleBookmarkSubmit = async (data: {
  title: string
  url: string
  description: string
  tags: string[]
  folder: string | null
}) => {
  if (editingBookmark.value) {
    const result = await bookmarkStore.updateBookmark(editingBookmark.value._id, data)
    if (result) {
      bookmarkDialogOpen.value = false
      editingBookmark.value = null
    }
  } else {
    const result = await bookmarkStore.createBookmark(data)
    if (result) {
      bookmarkDialogOpen.value = false
    }
  }
}

const openDeleteBookmarkDialog = (id: string) => {
  deleteTarget.value = { type: 'bookmark', id }
  deleteDialogOpen.value = true
}

// Folder actions
const openCreateFolderDialog = () => {
  editingFolder.value = null
  folderDialogOpen.value = true
}

const openEditFolderDialog = (folder: Folder) => {
  editingFolder.value = folder
  folderDialogOpen.value = true
}

const handleFolderSubmit = async (data: { name: string }) => {
  if (editingFolder.value) {
    const result = await folderStore.updateFolder(editingFolder.value._id, data)
    if (result) {
      folderDialogOpen.value = false
      editingFolder.value = null
    }
  } else {
    const result = await folderStore.createFolder(data)
    if (result) {
      folderDialogOpen.value = false
    }
  }
}

const openDeleteFolderDialog = (folderId: string) => {
  deleteTarget.value = { type: 'folder', id: folderId }
  deleteDialogOpen.value = true
}

const handleDeleteConfirm = async () => {
  if (!deleteTarget.value) return

  if (deleteTarget.value.type === 'bookmark') {
    await bookmarkStore.deleteBookmark(deleteTarget.value.id)
  } else {
    const success = await folderStore.deleteFolder(deleteTarget.value.id)
    if (success && selectedFolderId.value === deleteTarget.value.id) {
      selectedFolderId.value = null
    }
  }
  deleteTarget.value = null
}

const handleSelectFolder = (folderId: string | null) => {
  selectedFolderId.value = folderId
}

// Delete dialog computed
const deleteDialogTitle = computed(() => {
  if (!deleteTarget.value) return ''
  return deleteTarget.value.type === 'bookmark' ? 'Delete Bookmark' : 'Delete Folder'
})

const deleteDialogDescription = computed(() => {
  if (!deleteTarget.value) return ''
  return deleteTarget.value.type === 'bookmark'
    ? 'Are you sure you want to delete this bookmark? This action cannot be undone.'
    : 'Are you sure you want to delete this folder? Bookmarks in this folder will not be deleted.'
})

// Search
const handleSearch = async (query: string) => {
  await bookmarkStore.searchBookmarks(query)
}

// Logout
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// Import/Export
const handleExport = () => {
  const data = bookmarkStore.exportBookmarks()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`
  a.click()

  URL.revokeObjectURL(url)
}

const handleImportClick = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data)) {
      alert('Invalid file format: expected an array of bookmarks')
      return
    }

    const { successCount, failCount } = await bookmarkStore.importBookmarks(data)
    alert(`Import complete!\nSuccess: ${successCount}\nFailed: ${failCount}`)
  } catch {
    alert('Failed to parse file. Please make sure it is a valid JSON file.')
  }

  // Reset input
  input.value = ''
}

onMounted(() => {
  bookmarkStore.fetchBookmarks()
  folderStore.fetchFolders()
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hidden file input for import -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileChange"
    />
    <!-- Header -->
    <AppHeader @new-click="openCreateBookmarkDialog" @logout="handleLogout" />

    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex gap-6">
        <!-- Sidebar - Folders -->
        <aside class="w-64 flex-shrink-0">
          <div class="bg-card rounded-lg shadow border border-border p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-foreground">Folders</h2>
              <Button variant="ghost" size="icon" @click="openCreateFolderDialog">
                <FolderPlus class="size-4" />
              </Button>
            </div>

            <FolderList
              :folders="folderStore.folders"
              :selected-folder-id="selectedFolderId"
              @select="handleSelectFolder"
              @edit="openEditFolderDialog"
              @delete="openDeleteFolderDialog"
            />
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Toolbar -->
          <BookmarkToolbar
            @create="openCreateBookmarkDialog"
            @import="handleImportClick"
            @export="handleExport"
          />
          <!-- Search -->
          <div class="mb-6">
            <BookmarkSearch @search="handleSearch" />
          </div>

          <!-- Error -->
          <div
            v-if="bookmarkStore.error"
            class="bg-destructive/10 text-destructive p-3 rounded mb-4"
          >
            {{ bookmarkStore.error }}
          </div>

          <!-- Loading -->
          <div v-if="bookmarkStore.loading" class="text-center text-muted-foreground">
            Loading...
          </div>

          <!-- No bookmarks -->
          <div
            v-else-if="filteredBookmarks.length === 0"
            class="text-center text-muted-foreground py-8"
          >
            {{ selectedFolderId ? 'No bookmarks in this folder' : 'No bookmarks yet' }}
          </div>

          <!-- Bookmark list -->
          <BookmarkList
            v-else
            :bookmarks="filteredBookmarks"
            :get-folder-name="getFolderName"
            @edit="openEditBookmarkDialog"
            @delete="openDeleteBookmarkDialog"
            @reorder="handleReorder"
          />
        </main>
      </div>
    </div>

    <!-- Bookmark Form Dialog -->
    <BookmarkFormDialog
      v-model:open="bookmarkDialogOpen"
      :bookmark="editingBookmark"
      :folders="folderStore.folders"
      @submit="handleBookmarkSubmit"
    />

    <!-- Folder Form Dialog -->
    <FolderFormDialog
      v-model:open="folderDialogOpen"
      :folder="editingFolder"
      @submit="handleFolderSubmit"
    />

    <!-- Delete Confirm Dialog -->
    <DeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      :title="deleteDialogTitle"
      :description="deleteDialogDescription"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
