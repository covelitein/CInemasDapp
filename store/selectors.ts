import { RootState } from './types'

export const selectMovie = (state : any) => state.globalStates.movie
export const selectMovies = (state : any) => state.globalStates.movies
export const connectedAccount = (state : any) => state.globalStates.connectedAccount
export const deployer = (state : any) => state.globalStates.deployer
export const singleMovie = (state : any) => state.globalStates.singleMovie
export const updateMovieModal = (state : any) => state.globalStates.updateMovieModal
export const deleteMovieModal = (state : any) => state.globalStates.deleteMovieModal
export const addSlotModal = (state : any) => state.globalStates.addSlotModal
export const slotsForDay = (state : any) => state.globalStates.slotsForDay

export const slotsForMovie = (state: any)=> state.globalStates.slotsForMovie
export const movieToTicketHolderStatus = (state: any)=> state.globalStates.movieToTicketHolderStatus
export const slotsModal = (state: any)=> state.globalStates.slotsModal
export const ticketsModal = (state: any)=> state.globalStates.ticketsModal
export const ticketHolders = (state: any)=> state.globalStates.ticketHolders
export const group = (state: any)=> state.globalStates.group
export const currentUser = (state: any)=> state.globalStates.currentUser
export const authChatModal = (state: any)=> state.globalStates.authChatModal
export const chatCommandModal = (state: any)=> state.globalStates.chatCommandModal
export const chatModal = (state: any)=> state.globalStates.chatModal
export const messages = (state: any)=> state.globalStates.messages