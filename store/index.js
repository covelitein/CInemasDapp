import { configureStore } from '@reduxjs/toolkit'
import { Reducers, globalSlices } from './globalSlices'

export const store = configureStore({
  reducer: {
    globalStates: Reducers,
  },
})
