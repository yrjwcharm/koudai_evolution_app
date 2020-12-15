import actionTypes from '../actionTypes'
import { fromJS } from 'immutable'
const defaultState = fromJS({ // 将对象转成immutable对象
  name: '',
  age: ''
})

export default function userInfo (state = defaultState, action) {
  switch (action.type) {
    case actionTypes.LoginIn:
      return state.merge(fromJS(action.payload))
    default:
      return state
  }
}