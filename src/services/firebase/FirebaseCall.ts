import { api } from 'boot/axios'
import { useAuthStore } from 'src/stores/authStore'

export abstract class FirebaseCall<T> {
  static async post(path: string, data: object, resType = 'json', fullPath = false) {
    console.log('firebase call to ', path)
    const idToken = 'token-to-be-done' //await useAuthStore().user.getIdToken()
    //console.log("got idTOken", idToken)
    const urlToUse = fullPath ? path : `${process.env.BACKEND_URL}${path}`
    console.log('posting to', urlToUse)
    // @ts-ignore
    return api
      .post(urlToUse, data, { headers: { AuthToken: idToken }, responseType: resType })
      .catch((err: any) => {
        FirebaseCall.handleError(err)
        return Promise.reject(err)
      })
  }

  static patch(path: string, data: object, resType = 'json', fullPath = false) {
    console.log('firebase call to ', path)
    // TODO use approach as in onAuthStateChanged?
    useAuthStore()
      .user.getIdToken()
      .then((idToken: string) => {
        //console.log("got idTOken", idToken)
        const urlToUse = fullPath ? path : `${process.env.BACKEND_URL}${path}`
        console.log('posting to', urlToUse)
        // @ts-ignore
        return api
          .patch(urlToUse, data, { headers: { AuthToken: idToken }, responseType: resType })
          .catch((err: any) => {
            FirebaseCall.handleError(err)
            return Promise.reject(err)
          })
      })
  }

  // static put(path: string, data: object) {
  //   return useAuthStore().getToken(api).then((token: string) => {
  //     return api.put(`${process.env.BACKEND_URL}${path}`, data, {headers: {'AuthToken': token}})
  //       .catch((err: any) => {
  //         FirebaseCall.handleError(err)
  //         return Promise.reject("user not authenticated")
  //       })
  //   })
  // }

  private static handleError(err: any) {
    // if (axios.isAxiosError(err)) {
    //   const axiosError = err as AxiosError
    // if (axiosError.response?.status === 403) {
    console.warn('logging out due to invalid token (potentially expired)')
    //useAuthStore().logout();
    //Logz.info({"message": "logging out due to invalid token (potentially expired)"})
    //}
    // } else {
    //   console.error("error in firebase call", err)
    //   //Logz.info({"message": "error in firebase call" + err})
    // }
  }
}
