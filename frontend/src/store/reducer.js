function reducer(state, action) {
  let { count } = state;

  switch (action.type) {
    case 'inc':
      count++;
      return { ...state, count };
    case 'dec':
      count--;
      return { ...state, count };
    default:
      return { ...state, error: new Error() };
  }
}

export default reducer;
