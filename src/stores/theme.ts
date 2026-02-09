import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 從 localStorage 讀取，預設跟隨系統
  const getInitialTheme = (): 'light' | 'dark' => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    // 跟隨系統偏好
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const theme = ref<'light' | 'dark'>(getInitialTheme())

  const isDark = () => theme.value === 'dark'

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  // 監聽變化，更新 DOM 和 localStorage
  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('theme', newTheme)
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    { immediate: true },
  )

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  }
})
