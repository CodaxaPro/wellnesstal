// utils/idGenerator.ts
// ID Generation Utilities

/**
 * Unique ID oluştur
 * Format: type-timestamp-random
 * Örnek: "stack-1696680000000-k3j9x2"
 */
export function generateId(type: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${type}-${timestamp}-${random}`;
}

/**
 * Obje içindeki tüm ID'leri yeniden oluştur (deep clone + regenerate)
 * Duplicate işlemlerinde kullanılır
 */
export function regenerateIds(obj: any): any {
  // Array ise
  if (Array.isArray(obj)) {
    return obj.map(regenerateIds);
  }
  
  // Object ise
  if (obj && typeof obj === 'object') {
    const newObj = { ...obj };
    
    // ID varsa yenile
    if (newObj.id && typeof newObj.id === 'string') {
      const type = newObj.type || 'element';
      newObj.id = generateId(type);
    }
    
    // Tüm property'leri recursive işle
    Object.keys(newObj).forEach((key) => {
      newObj[key] = regenerateIds(newObj[key]);
    });
    
    return newObj;
  }
  
  // Primitive değer ise
  return obj;
}

/**
 * Batch ID oluştur
 * Örnek: generateBatchIds('text', 5) → ['text-...', 'text-...', ...]
 */
export function generateBatchIds(type: string, count: number): string[] {
  return Array.from({ length: count }, () => generateId(type));
}

/**
 * ID'den type'ı çıkar
 * Örnek: "stack-1696680000000-k3j9x2" → "stack"
 */
export function getTypeFromId(id: string): string | null {
  const parts = id.split('-');
  return parts.length > 0 ? parts[0] : null;
}

/**
 * ID'nin geçerli olup olmadığını kontrol et
 */
export function isValidId(id: string): boolean {
  if (!id || typeof id !== 'string') {
return false;
}
  
  // Format: type-timestamp-random
  const parts = id.split('-');
  
  if (parts.length < 3) {
return false;
}
  
  // Timestamp numeric mi?
  const timestamp = parseInt(parts[1], 10);
  if (isNaN(timestamp)) {
return false;
}
  
  // Random string var mı?
  if (parts[2].length < 5) {
return false;
}
  
  return true;
}

/**
 * Short ID oluştur (UI'da gösterim için)
 * Örnek: "stack-1696680000000-k3j9x2" → "k3j9x2"
 */
export function getShortId(id: string): string {
  const parts = id.split('-');
  return parts.length > 2 ? parts[parts.length - 1] : id;
}

/**
 * ID'yi human-readable format'a çevir
 * Örnek: "hero-main-stack" → "Hero Main Stack"
 */
export function formatIdForDisplay(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}