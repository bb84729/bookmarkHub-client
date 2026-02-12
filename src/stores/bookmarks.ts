import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Bookmark, CreateBookmarkData, UpdateBookmarkData } from '@/types'

export const useBookmarkStore = defineStore('bookmarks', () => {
  const bookmarks = ref<Bookmark[]>([])
  const loading = ref(false)
  const error = ref('')

  const fetchBookmarks = async () => {
    try {
      loading.value = true
      error.value = ''
      const { data } = await api.get<Bookmark[]>('/bookmarks')
      bookmarks.value = data
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to fetch bookmarks'
    } finally {
      loading.value = false
    }
  }

  const createBookmark = async (data: CreateBookmarkData) => {
    try {
      error.value = ''
      const { data: newBookmark } = await api.post<Bookmark>('/bookmarks', data)
      bookmarks.value.push(newBookmark)
      return newBookmark
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to create bookmark'
      return null
    }
  }

  const deleteBookmark = async (id: string) => {
    try {
      error.value = ''
      await api.delete(`/bookmarks/${id}`)
      bookmarks.value = bookmarks.value.filter((b) => b._id !== id)
      return true
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to delete bookmark'
      return false
    }
  }

  const updateBookmark = async (id: string, data: UpdateBookmarkData) => {
    try {
      error.value = ''
      const { data: updatedBookmark } = await api.put<Bookmark>(`/bookmarks/${id}`, data)
      // 更新 bookmarks 陣列中對應的書籤
      const index = bookmarks.value.findIndex((b) => b._id === id)
      if (index !== -1) {
        bookmarks.value[index] = updatedBookmark
      }
      return updatedBookmark
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to update bookmark'
      return null
    }
  }

  const searchBookmarks = async (query: string) => {
    try {
      loading.value = true
      error.value = ''
      const params = query ? { search: query } : {}
      const { data } = await api.get<Bookmark[]>('/bookmarks', { params })
      bookmarks.value = data
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to search bookmarks'
    } finally {
      loading.value = false
    }
  }

  // 批次匯入書籤
  const importBookmarks = async (items: CreateBookmarkData[]) => {
    let successCount = 0
    let failCount = 0

    loading.value = true
    error.value = ''

    for (const item of items) {
      try {
        const { data: newBookmark } = await api.post<Bookmark>('/bookmarks', item)
        bookmarks.value.push(newBookmark)
        successCount++
      } catch {
        failCount++
      }
    }

    loading.value = false

    return { successCount, failCount }
  }

  // 匯出書籤（回傳乾淨的資料）
  const exportBookmarks = () => {
    return bookmarks.value.map((b) => ({
      title: b.title,
      url: b.url,
      description: b.description || '',
      tags: b.tags || [],
    }))
  }

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    createBookmark,
    deleteBookmark,
    searchBookmarks,
    updateBookmark,
    importBookmarks,
    exportBookmarks,
  }
})
