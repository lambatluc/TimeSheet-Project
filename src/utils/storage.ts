export const getStorage = (key: string): any | null => {
  const item = localStorage.getItem(key);
  try {
    return item !== null ? JSON.parse(item) : item;
  } catch {
    return item;
  }
};
export const setStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const removeStorage = (key: string): void => {
  localStorage.removeItem(key);
};
