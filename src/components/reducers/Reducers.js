
export const Reducers = (state, action) => {
  switch (action.type) {
    case "USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "UPDATE":
      return { ...state, followers:action.payload.followers, following:action.payload.following };
    default:
      return state;
  }
};
