import AsyncStorage from '@react-native-community/async-storage'
import merge from 'lodash/merge'

export default class Storage {
  /**
   * Get a one or more value for a key or array of keys from AsyncStorage
   * @param {String|Array} key A key or array of keys
   * @return {Promise}
   */
  static get (key) {
    if (!Array.isArray(key)) {
      return AsyncStorage.getItem(key).then(value => {
        return JSON.parse(value)
      })
    } else {
      return AsyncStorage.multiGet(key).then(values => {
        return values.map(value => {
          return JSON.parse(value[1])
        })
      })
    }
  }

  /**
   * Save a key value pair or a series of key value pairs to AsyncStorage.
   * @param  {String|Array} key The key or an array of key/value pairs
   * @param  {Any} value The value to save
   * @return {Promise}
   */
  static save (key, value) {
    if (!Array.isArray(key)) {
      return AsyncStorage.setItem(key, JSON.stringify(value))
    } else {
      const pairs = key.map(function (pair) {
        return [pair[0], JSON.stringify(pair[1])]
      })
      return AsyncStorage.multiSet(pairs)
    }
  }

  /**
   * Updates the value in the store for a given key in AsyncStorage. If the value is a string it will be replaced. If the value is an object it will be deep merged.
   * @param  {String} key The key
   * @param  {Value} value The value to update with
   * @return {Promise}
   */
  static update (key, value) {
    return this.get(key).then(item => {
      value = typeof value === 'string' ? value : merge({}, item, value)
      return AsyncStorage.setItem(key, JSON.stringify(value))
    })
  }

  /**
   * Delete the value for a given key in AsyncStorage.
   * @param  {String|Array} key The key or an array of keys to be deleted
   * @return {Promise}
   */
  static delete (key) {
    if (Array.isArray(key)) {
      return AsyncStorage.multiRemove(key)
    } else {
      return AsyncStorage.removeItem(key)
    }
  }

  /**
   * Get all keys in AsyncStorage.
   * @return {Promise} A promise which when it resolves gets passed the saved keys in AsyncStorage.
   */
  static keys () {
    return AsyncStorage.getAllKeys()
  }
}

