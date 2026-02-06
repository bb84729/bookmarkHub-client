import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Folder, CreateFolderData, UpdateFolderData } from '@/types'

export const useFolderStore = defineStore('folders', () => {
  const folders = ref<Folder[]>([])
  const loading = ref(false)
  const error = ref('')

  const fetchFolders = async () => {
    try {
      loading.value = true
      error.value = ''
      const { data } = await api.get<Folder[]>('/folders')
      folders.value = data
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to fetch folders'
    } finally {
      loading.value = false
    }
  }

  const createFolder = async (data: CreateFolderData) => {
    try {
      error.value = ''
      const { data: newFolder } = await api.post<Folder>('/folders', data)
      folders.value.push(newFolder)
      return newFolder
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to create folder'
      return null
    }
  }

  const updateFolder = async (id: string, data: UpdateFolderData) => {
    try {
      error.value = ''
      const { data: updatedFolder } = await api.put<Folder>(`/folders/${id}`, data)
      const index = folders.value.findIndex((f) => f._id === id)
      if (index !== -1) {
        folders.value[index] = updatedFolder
      }
      return updatedFolder
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to update folder'
      return null
    }
  }

  const deleteFolder = async (id: string) => {
    try {
      error.value = ''
      await api.delete(`/folders/${id}`)
      folders.value = folders.value.filter((f) => f._id !== id)
      return true
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      error.value = axiosError.response?.data?.error || 'Failed to delete folder'
      return false
    }
  }

  return {
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  }
})
