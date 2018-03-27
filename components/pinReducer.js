export const pinReducer = (state, action)=> {
  if (state === undefined) {
    state = [];
  }
  if (action.type === 'ADD_USER') {

    return [action.data, ...state];

  }
  if (action.type === 'USER_LIST_SUCCESS') {
    state= (action.data);
  }
  return state;
}