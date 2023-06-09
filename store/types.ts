 export interface GlobalState {
  deployer: string;
}

export interface RootState {
  globalStates: GlobalState;
}

export interface MyPageProps {
    deployer: string;
    connectedAccount: string;
}

export interface paramProps {
  payload: any
}