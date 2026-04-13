/**
 * 計算拖曳排序後，每個書籤應該對應的 order 值
 * 需要加上分頁的 offset，讓跨頁排序正確
 *
 * @param ids - 拖曳後的書籤 ID 陣列（已是新順序）
 * @param page - 當前頁碼（從 1 開始）
 * @param limit - 每頁筆數
 * @returns 每個書籤的 { id, order } 陣列
 */

export function calculateReorderItems(
  ids: string[],
  page: number,
  limit: number,
): { id: string; order: number }[] {
  const offset = (page - 1) * limit

  return ids.map((id, index) => ({
    id,
    order: offset + index,
  }))
}

/**
 * 取得網站的 favicon URL（透過 Google S2 服務）
 *
 * @param url - 網站網址
 * @returns favicon URL，若網址無效則回傳 null
 */
export function getFaviconUrl(url: string): string | null {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return null
  }
}
