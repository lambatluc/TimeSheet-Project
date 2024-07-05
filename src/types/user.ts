export interface IUserCredential {
  userNameOrEmailAddress: string
  password: string
  rememberClient: boolean
}

export interface IAuthResponse {
  accessToken: string
  encryptedAccessToken: string
  expireInSeconds: number
  userId: number
}

export interface IClient {
  name: string
  code: string
  id: number
}
export interface INewClient {
  name: string
  code: string
  address: string
}

export interface IUser {
  userName: string
  name: string
  surname: string
  emailAddress: string
  address: string
  roleNames: string[]
  avatarPath: string
  avatarFullPath: string
  branchColor?: string
  branchDisplayName: string
  branchId: number
  positionId: number
  isActive: boolean
  type?: number
  id: number
}

export interface IUserTeam {
  projectType?: number
  isTemp: boolean
  userId: number
  type?: number
}

export interface IUserProjectTeam {
  billableWorkingTime: number
  projectUserType: number
  userId: number
  totalWorkingTime: number
  userName: string
  userID?: number
}

export interface IUserInfoResult {
  application: {
    version: string
    releaseDate: string
  }
  tenant: null
  user: IUser
}
