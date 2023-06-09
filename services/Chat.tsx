/* eslint-disable eqeqeq */
/* eslint-disable no-async-promise-executor */
import { CometChat } from '@cometchat-pro/chat'
import { store } from '@/store'


const CONSTANTS = {
  APP_ID: process.env.NEXT_APP_COMET_CHAT_APP_ID,
  REGION: process.env.NEXT_APP_COMET_CHAT_REGION,
  Auth_Key: process.env.NEXT_APP_COMET_CHAT_AUTH_KEY,
}
console.log(CONSTANTS.APP_ID)
const initCometChat = async (CometChat: any) => {
  const appID = CONSTANTS.APP_ID
  const region = CONSTANTS.REGION

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build()

  await CometChat.init(appID, appSetting)
    .then(() => console.log('Initialization completed successfully'))
    .catch((error: any) => console.log(error))
}

const loginWithCometChat = async (CometChat: any, UID: any) => {
  const authKey = CONSTANTS.Auth_Key

  return new Promise(async (resolve, reject) => {
    await CometChat.login(UID, authKey)
      .then((user: any) => resolve(user))
      .catch((error: any) => reject(error))
  })
}

const signUpWithCometChat = async (CometChat: any, UID: any) => {
  const authKey = CONSTANTS.Auth_Key
  const user = new CometChat.User(UID)

  user.setName(UID)
  return new Promise(async (resolve, reject) => {
    await CometChat.createUser(user, authKey)
      .then((user: any) => resolve(user))
      .catch((error: any) => reject(error))
  })
}

const logOutWithCometChat = async (CometChat: any) => {
  return new Promise<void>(async (resolve, reject) => {
    await CometChat.logout()
      .then(() => resolve())
      .catch((err: any) => reject(err))
  })
}

const checkAuthState = async (CometChat: any) => {
  return new Promise(async (resolve, reject) => {
    await CometChat.getLoggedinUser()
      .then((user: any) => resolve(user))
      .catch((error: any) => reject(error))
  })
}

const createNewGroup = async (CometChat: any, GUID: any, groupName: any) => {
  const groupType = CometChat.GROUP_TYPE.PUBLIC
  const password = ''
  const group = new CometChat.Group(GUID, groupName, groupType, password)

  return new Promise(async (resolve, reject) => {
    await CometChat.createGroup(group)
      .then((group: any) => resolve(group))
      .catch((error: any) => reject(error))
  })
}

const getGroup = async (CometChat: any, GUID: any) => {
  return new Promise(async (resolve, reject) => {
    await CometChat.getGroup(GUID)
      .then((group: any) => resolve(group))
      .catch((error: any) => reject(error))
  })
}

const joinGroup = async (CometChat: any, GUID: any) => {
  const groupType = CometChat.GROUP_TYPE.PUBLIC
  const password = ''

  return new Promise(async (resolve, reject) => {
    await CometChat.joinGroup(GUID, groupType, password)
      .then((group: any) => resolve(group))
      .catch((error: any) => reject(error))
  })
}

const getMessages = async (CometChat: any, GUID: any) => {
  const limit = 30
  const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setGUID(GUID)
    .setLimit(limit)
    .build()

  return new Promise(async (resolve, reject) => {
    await messagesRequest
      .fetchPrevious()
      .then((messages: any) => resolve(messages.filter((msg: any) => msg.type == 'text')))
      .catch((error: any) => reject(error))
  })
}

const sendMessage = async (CometChat: any, receiverID: any, messageText: any) => {
  const receiverType = CometChat.RECEIVER_TYPE.GROUP
  const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType)
  return new Promise(async (resolve, reject) => {
    await CometChat.sendMessage(textMessage)
      .then((message: any) => resolve(message))
      .catch((error: any) => reject(error))
  })
}

const listenForMessage = async (CometChat: any, listenerID: any) => {
  return new Promise(async (resolve, reject) => {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message: any) => resolve(message),
      })
    )
  })
}

export {
  initCometChat,
  loginWithCometChat,
  signUpWithCometChat,
  logOutWithCometChat,
  checkAuthState,
  createNewGroup,
  getGroup,
  getMessages,
  joinGroup,
  sendMessage,
  listenForMessage,
}
