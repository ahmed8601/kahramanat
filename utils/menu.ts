// Utilities for safely validating and normalizing menu data before rendering

export interface NormalizedMenu {
  categories: any[];
  dishes: any[];
  currency: string;
}

export function validateMenuData(raw: any): NormalizedMenu | null {
  try {
    if (!raw || typeof raw !== 'object') return null;
    const categories = Array.isArray(raw.categories) ? raw.categories : [];
    const dishes = Array.isArray(raw.dishes) ? raw.dishes : [];
    const currency = typeof raw.currency === 'string' && raw.currency.length > 0 ? raw.currency : 'BHD';
    return { categories, dishes, currency };
  } catch {
    return null;
  }
}

export default {
  validateMenuData
};
