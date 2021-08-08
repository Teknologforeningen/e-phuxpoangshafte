import { User } from "../types"

export const localStorageSetter  = (name: string, value: any): boolean => {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(name,value)
      return true
    } catch (e) {
      console.error('Local storage is not available,', name, 'was not set.')
      return false
    }
  }
  else{
    console.error('Local storage is not available,', name, 'was not set.')
    return false
  }
}

export const localStorageGetter = (name: string): User | null => {
  if (typeof localStorage !== 'undefined') {
    try {
      const data = localStorage.getItem(name)
      if(data !== null){
        return JSON.parse(data) //Checka de här...
      } else return null
    } catch (e) {
      console.error('Local storage is not available,', name, 'could not be fetched.')
      return null
    }
  }
  console.error('Local storage is not available,', name, 'could not be fetched.')
  return null
}