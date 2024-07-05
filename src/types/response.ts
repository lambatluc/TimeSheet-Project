export interface IAppResponse<T> {
  error: {
    code: number
    message: string
    details: string
  } | null
  result: T
  success: boolean
  unAuthorizedRequest: boolean
  __adp: boolean
}
