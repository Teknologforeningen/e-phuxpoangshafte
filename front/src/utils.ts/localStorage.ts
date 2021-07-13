export const localStorageSetter  = (name: string, value: string) => {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(name,value)
    } catch (e) {
      console.error('Local storage is not available,', name, 'was not set.')
    }
  }
  else{
    console.error('Local storage is not available,', name, 'was not set.')
  }
}

export const localStorageGetter = (name: string) => {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.getItem(name)
    } catch (e) {
      console.error('Local storage is not available,', name, 'could not be fetched.')
    }
    console.error('Local storage is not available,', name, 'could not be fetched.')
  }
}