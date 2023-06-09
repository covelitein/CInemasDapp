import abi from '@/artifacts/contracts/DappCinemas.sol/DappCinemas.json'
import address from '@/artifacts/contractAddress.json'
import { ethers } from 'ethers'
import { globalActions } from '@/store/globalSlices'
import { store } from '@/store'
import { logOutWithCometChat } from './Chat'

const {
  setConnectedAccount,
  setCurrentUser,
  setMovieToTicketHolderStatus,
  setDeployer,
  setSlotsForDay,
  setTicketHolders,
} = globalActions

const contractAddress = address.address
const contractAbi = abi.abi
let tx
if (typeof window !== 'undefined') {
  ethereum = window.ethereum
}

const toWei = (num) => ethers.utils.parseEther(num.toString())

const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)

  return contract
}

const ssrEthereumContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  const wallet = ethers.Wallet.createRandom()
  const signer = provider.getSigner(wallet.address)
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)
  return contract
}

const walletConnectedStatus = async (CometChat) => {
  try {
    if (!ethereum) return notifyUser('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

      if (!CometChat) console.log('Unavailable')
      store.dispatch(setConnectedAccount(accounts[0]))
      store.dispatch(setCurrentUser(null))
      logOutWithCometChat(CometChat).then(() => console.log('Logged out'))
      await walletConnectedStatus(CometChat)
    })

    if (accounts.length) {
      store.dispatch(setConnectedAccount(accounts[0]))
    } else {
      store.dispatch(setConnectedAccount(''))
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    store.dispatch(setConnectedAccount(accounts[0]))
  } catch (error) {
    reportError(error)
  }
}

const addMovie = async ({ name, imageUrl, genre, description }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()
    tx = await contract.addMovie(name, imageUrl, genre, description, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const updateMovie = async ({ id, name, imageUrl, genre, description }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()
    tx = await contract.updateMovie(id, name, imageUrl, genre, description, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const deleteMovie = async (id) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()
    tx = await contract.deleteMovie(id, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const addSlot = async ({ movieId, ticketCost, startTime, endTime, capacity, day }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()

    tx = await contract.addSlot(movieId, toWei(ticketCost), startTime, endTime, capacity, day, {
      from: connectedAccount,
    })

    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const deleteSlot = async ({ id, movieId }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()

    tx = await contract.deleteSlot(id, movieId, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const publishTimeSlot = async ({ id, movieId, day }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()
    tx = await contract.publishTimeSlot(id, movieId, day, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const buyTicket = async ({ movieId, day, id, ticketCost }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()
    tx = await contract.buyTicket(movieId, day, id, {
      from: connectedAccount,
      value: toWei(ticketCost),
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const withdraw = async ({ movieId, id }) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const connectedAccount = store.getState().globalStates.connectedAccount
    const contract = await getEthereumContract()
    tx = await contract.withdraw(movieId, id, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const movieToTicketHolders = async (movieId) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const connectedAccount = store.getState().globalStates.connectedAccount

    const contract = await getEthereumContract()

    const result = await contract.checkForTicketHolders(movieId, {
      from: connectedAccount,
    })
    store.dispatch(setMovieToTicketHolderStatus(result))
  } catch (err) {
    reportError(err)
  }
}

const getMovies = async () => {
  try {
    const contract = await ssrEthereumContract()
    const movies = await contract.getMovies()
    return structuredMovie(movies)
  } catch (err) {
    console.log(err)
  }
}

const getMovie = async (id) => {
  try {
    const contract = await ssrEthereumContract()
    const movie = await contract.getMovie(id)
    return structuredMovie([movie])[0]
  } catch (err) {
    console.log(err)
  }
}

const getSlots = async (day) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await ssrEthereumContract()
    const slots = await contract.getSlots(day)
    store.dispatch(setSlotsForDay(structuredTimeslot(slots)))
  } catch (err) {
    reportError(err)
  }
}

const getTicketHolders = async (movieId, id) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()
    const ticketHolders = await contract.getTicketHolders(movieId, id)
    store.dispatch(setTicketHolders(structuredTicket(ticketHolders)))
  } catch (err) {
    reportError(err)
  }
}

const movieSlots = async (movieId) => {
  try {
    const contract = await ssrEthereumContract()
    const slots = await contract.getSlotsForMovie(movieId)
    return structuredTimeslot(slots)
  } catch (err) {
    console.log(err)
  }
}

const getOwner = async () => {
  try {
    const contract = await ssrEthereumContract()
    const deployer = await contract.returnOwner()
    store.dispatch(setDeployer(deployer))
  } catch (err) {
    console.log(err)
  }
}

const structuredMovie = (movies) =>
  movies.map((movie) => ({
    id: Number(movie.id),
    name: movie.name,
    imageUrl: movie.imageUrl,
    genre: movie.genre,
    description: movie.description,
    timestamp: new Date(movie.timestamp).getTime(),
    deleted: movie.deleted,
  }))

const structuredTimeslot = (slots) =>
  slots.map((slot) => ({
    id: Number(slot.id),
    movieId: Number(slot.movieId),
    ticketCost: parseInt(slot.ticketCost._hex) / 10 ** 18,
    startTime: slot.startTime.toNumber(),
    endTime: slot.endTime.toNumber(),
    capacity: Number(slot.capacity),
    seatings: Number(slot.seatings),
    deleted: slot.deleted,
    published: slot.published,
    day: slot.day.toNumber(),
  }))

const structuredTicket = (tickets) =>
  tickets.map((ticket) => ({
    id: Number(ticket.id),
    movieId: Number(ticket.movieId),
    slotId: Number(ticket.slotId),
    owner: ticket.owner.toLowerCase(),
    cost: parseInt(ticket.cost._hex) / 10 ** 18,
    timestamp: new Date(ticket.timestamp).getTime(),
    day: new Date(ticket.day).getTime(),
    refunded: ticket.refunded,
  }))

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}

export {
  walletConnectedStatus,
  addMovie,
  getOwner,
  connectWallet,
  getMovies,
  truncate,
  updateMovie,
  deleteMovie,
  addSlot,
  deleteSlot,
  publishTimeSlot,
  buyTicket,
  withdraw,
  getMovie,
  getSlots,
  getTicketHolders,
  movieToTicketHolders,
  movieSlots,
}
