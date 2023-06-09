export const globalActions = {
  setMovie: (state: any, action: { payload: any }) => {
    state.movie = action.payload
  },
  setMovies: (state: any, action: { payload: any }) => {
    state.movies = action.payload
  },
  setSingleMovie: (state: any, action: { payload: any }) => {
    state.singleMovie = action.payload
  },
  setSlotsForDay: (state: any, action: { payload: any }) => {
    state.slotsForDay = action.payload
  },
  setSlotsForMovie: (state: any, action: { payload: any }) => {
    state.slotsForMovie = action.payload
  },
  setTicketHolders: (state: any, action: { payload: any }) => {
    state.ticketHolders = action.payload
  },
  setMovieToTicketHolderStatus: (state: any, action: { payload: any }) => {
    state.movieToTicketHolderStatus = action.payload
  },
  setConnectedAccount: (state: any, action: { payload: any }) => {
    state.connectedAccount = action.payload
  },
  setMessages: (state: any, action: { payload: any }) => {
    state.messages = action.payload
  },
  setDeployer: (state: any, action: { payload: any }) => {
    state.deployer = action.payload
  },
  setUpdateMovieModal: (state: any, action: { payload: any }) => {
    state.updateMovieModal = action.payload
  },
  setDeleteMovieModal: (state: any, action: { payload: any }) => {
    state.deleteMovieModal = action.payload
  },
  setSlotsModal: (state: any, action: { payload: any }) => {
    state.slotsModal = action.payload
  },
  setTicketsModal: (state: any, action: { payload: any }) => {
    state.ticketsModal = action.payload
  },
  setAddSlotModal: (state: any, action: { payload: any }) => {
    state.addSlotModal = action.payload
  },
  setCurrentUser: (state: any, action: { payload: any }) => {
    state.currentUser = action.payload
  },
  setChatModal: (state: any, action: { payload: any }) => {
    state.chatModal = action.payload
  },
  setChatCommandModal: (state: any, action: { payload: any }) => {
    state.chatCommandModal = action.payload
  },
  setAuthChatModal: (state: any, action: { payload: any }) => {
    state.authChatModal = action.payload
  },
  setGroup: (state: any, action: { payload: any }) => {
    state.group = action.payload
  },
}
