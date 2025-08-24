// 判断是否是图片
export function isImageURL(url: string): boolean {
  if (!url) return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  return imageExtensions?.some(ext => url?.toLowerCase().endsWith(ext));
}