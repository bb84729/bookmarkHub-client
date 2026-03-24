// 使用者
export interface User {
  _id: string
  email: string
  name: string
}

// 登入回傳
export interface LoginResponse {
  accessToken: string
  refreshToken: string
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

// 分頁資訊
export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// 有分頁的 API 回傳格式
export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
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

// 更新書籤資料
export interface UpdateBookmarkData {
  title?: string
  url?: string
  description?: string
  tags?: string[]
}

// 新增資料夾資料
export interface CreateFolderData {
  name: string
}

// 更新資料夾資料
export interface UpdateFolderData {
  name: string
}

// API 錯誤
export interface ApiError {
  error: string
  details?: unknown[]
}
