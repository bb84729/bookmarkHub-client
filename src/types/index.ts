// 使用者
export interface User {
  _id: string
  email: string
  name: string
}

// 登入回傳
export interface LoginResponse {
  token: string
  user: User
}

// 書籤
export interface Bookmark {
  _id: string
  title: string
  url: string
  description?: string
  tags: string[]
  folder?: string
  user: string
  createdAt: string
}

// 資料夾
export interface Folder {
  _id: string
  name: string
  user: string
  createdAt: string
}

// 新增書籤資料
export interface CreateBookmarkData {
  title: string
  url: string
  description?: string
  tags?: string[]
}

// API 錯誤
export interface ApiError {
  error: string
  details?: unknown[]
}
