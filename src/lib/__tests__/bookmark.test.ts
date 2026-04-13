import { describe, it, expect } from 'vitest'
import { calculateReorderItems, getFaviconUrl } from '@/lib/bookmark'

describe('getFaviconUrl', () => {
  // ============================================
  // 基本行為：正常網址應回傳 Google favicon URL
  // ============================================
  it('正常網址：回傳對應的 favicon URL', () => {
    const result = getFaviconUrl('https://www.github.com/user/repo')
    expect(result).toBe('https://www.google.com/s2/favicons?domain=www.github.com&sz=32')
  })

  // ============================================
  // 不同協定：http 也能正確解析
  // ============================================
  it('http 網址也能正確解析', () => {
    const result = getFaviconUrl('http://example.com')
    expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=32')
  })

  // ============================================
  // 含路徑和查詢參數：只取 hostname
  // ============================================
  it('含路徑和查詢參數時，只取 hostname', () => {
    const result = getFaviconUrl('https://docs.google.com/spreadsheets/d/123?edit=true')
    expect(result).toBe('https://www.google.com/s2/favicons?domain=docs.google.com&sz=32')
  })

  // ============================================
  // 含 port 的網址：hostname 不含 port
  // ============================================
  it('含 port 的網址：hostname 不含 port', () => {
    const result = getFaviconUrl('http://localhost:3000/dashboard')
    expect(result).toBe('https://www.google.com/s2/favicons?domain=localhost&sz=32')
  })

  // ============================================
  // 無效網址：回傳 null
  // ============================================
  it('無效網址回傳 null', () => {
    expect(getFaviconUrl('not-a-url')).toBeNull()
  })

  it('空字串回傳 null', () => {
    expect(getFaviconUrl('')).toBeNull()
  })
})

describe('calculateReorderItems', () => {
  // ============================================
  // 基本行為：第一頁，offset 應該是 0
  // ============================================
  it('第一頁：order 從 0 開始', () => {
    const ids = ['a', 'b', 'c']
    const result = calculateReorderItems(ids, 1, 10)

    expect(result).toEqual([
      { id: 'a', order: 0 },
      { id: 'b', order: 1 },
      { id: 'c', order: 2 },
    ])
  })

  // ============================================
  // 核心場景：第二頁，offset = (2-1) * 10 = 10
  // ============================================
  it('第二頁 limit=10：order 從 10 開始', () => {
    const ids = ['x', 'y', 'z']
    const result = calculateReorderItems(ids, 2, 10)

    expect(result).toEqual([
      { id: 'x', order: 10 },
      { id: 'y', order: 11 },
      { id: 'z', order: 12 },
    ])
  })

  // ============================================
  // 之前踩過的坑：第三頁 + 不同的 limit
  // offset = (3-1) * 5 = 10
  // ============================================
  it('第三頁 limit=5：order 從 10 開始', () => {
    const ids = ['a', 'b', 'c', 'd', 'e']
    const result = calculateReorderItems(ids, 3, 5)

    expect(result).toEqual([
      { id: 'a', order: 10 },
      { id: 'b', order: 11 },
      { id: 'c', order: 12 },
      { id: 'd', order: 13 },
      { id: 'e', order: 14 },
    ])
  })

  // ============================================
  // 拖曳後順序改變：驗證新順序有正確反映
  // 原本是 [a, b, c]，使用者把 c 拖到最前面 → [c, a, b]
  // ============================================
  it('拖曳改變順序後，order 應反映新的位置', () => {
    // 拖曳前：[a, b, c] → 拖曳後：[c, a, b]
    const reorderedIds = ['c', 'a', 'b']
    const result = calculateReorderItems(reorderedIds, 1, 10)

    expect(result).toEqual([
      { id: 'c', order: 0 }, // c 被拖到最前面
      { id: 'a', order: 1 },
      { id: 'b', order: 2 },
    ])
  })

  // ============================================
  // 邊界情況：空陣列
  // ============================================
  it('空陣列回傳空結果', () => {
    const result = calculateReorderItems([], 1, 10)
    expect(result).toEqual([])
  })

  // ============================================
  // 邊界情況：只有一筆
  // ============================================
  it('只有一筆書籤', () => {
    const result = calculateReorderItems(['only'], 2, 10)

    expect(result).toEqual([{ id: 'only', order: 10 }])
  })

  // ============================================
  // 完整頁面：limit 筆全滿的情況
  // ============================================
  it('整頁滿載時，最後一筆的 order 正確', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `item-${i}`)
    const result = calculateReorderItems(ids, 2, 10)

    // 第二頁第一筆 = 10, 最後一筆 = 19
    expect(result[0].order).toBe(10)
    expect(result[9].order).toBe(19)
    expect(result).toHaveLength(10)
  })
})
