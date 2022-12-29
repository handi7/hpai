export default function user(state = {}, action) {
  switch (action.type) {
    case "AUTHENTICATED":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
