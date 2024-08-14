import { isJson } from './validate'

export const getLocalStorage = (key: string) => {
  const value: any = localStorage.getItem(key)
  if (value && isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}

export const setLocalStorage = (key: string, value: any) => {
  try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
  } catch (error) {
      console.error("Failed to store item in localStorage:", error);
  }
}


export const removeLocalStorage = (key:string) => {
  try {
      localStorage.removeItem(key);
      console.log(`Item with key '${key}' has been removed from localStorage.`);
  } catch (error) {
      console.error("Failed to remove item from localStorage:", error);
  }
}

