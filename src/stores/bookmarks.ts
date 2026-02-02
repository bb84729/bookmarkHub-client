import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Bookmark, CreateBookmarkData } from '@/types'

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
      bookmarks.value.unshift(newBookmark)
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

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    createBookmark,
    deleteBookmark,
    searchBookmarks,
  }
})
