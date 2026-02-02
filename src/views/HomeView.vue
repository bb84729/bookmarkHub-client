<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmarks'

const router = useRouter()
const store = useBookmarkStore()

// 新增書籤的表單
const showForm = ref(false)
const newTitle = ref('')
const newUrl = ref('')
const newDescription = ref('')
const newTags = ref('')

// 搜尋
const searchQuery = ref('')

// 新增書籤
const handleCreate = async () => {
  const result = await store.createBookmark({
    title: newTitle.value,
    url: newUrl.value,
    description: newDescription.value,
    tags: newTags.value ? newTags.value.split(',').map((t) => t.trim()) : [],
  })

  if (result) {
    // 清空表單
    newTitle.value = ''
    newUrl.value = ''
    newDescription.value = ''
    newTags.value = ''
    showForm.value = false
  }
}

// 刪除書籤
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this bookmark?')) {
    return
  }

  await store.deleteBookmark(id)
}

const handleSearch = async () => {
  await store.searchBookmarks(searchQuery.value)
}

// 登出
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
    <header class="bg-white shadow">
      <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-blue-600">BookmarkHub</h1>
        <div class="flex gap-4">
          <button
            @click="showForm = !showForm"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {{ showForm ? 'Cancel' : '+ New' }}
          </button>
          <button @click="handleLogout" class="text-gray-600 hover:text-red-600">Logout</button>
        </div>
      </div>
    </header>
    <!-- 搜尋欄 -->
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <form @submit.prevent="handleSearch" class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search bookmarks..."
        />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>
    </div>
    <!-- Main -->
    <main class="max-w-5xl mx-auto px-4 py-8">
      <!-- 新增書籤表單 -->
      <div v-if="showForm" class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-lg font-bold mb-4">New Bookmark</h2>
        <form @submit.prevent="handleCreate">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Title</label>
            <input
              v-model="newTitle"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">URL</label>
            <input
              v-model="newUrl"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Description</label>
            <input
              v-model="newDescription"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Tags</label>
            <input
              v-model="newTags"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>

      <!-- Error -->
      <div v-if="store.error" class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {{ store.error }}
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="text-center text-gray-500">Loading...</div>

      <!-- 沒有書籤 -->
      <div v-else-if="store.bookmarks.length === 0" class="text-center text-gray-500">
        No bookmarks yet
      </div>

      <!-- 書籤列表 -->
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
            <button @click="handleDelete(bookmark._id)" class="text-gray-400 hover:text-red-600">
              ✕
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
