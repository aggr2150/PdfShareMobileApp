import axios, {AxiosInstance} from 'axios';
import UserAgent from 'react-native-user-agent';

export const apiInstance: AxiosInstance = axios.create({
  // baseURL: 'https://everypdf.cc',
  // baseURL: 'http://localhost:3000',
  baseURL: 'http://10.0.2.2:3000',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'User-Agent': UserAgent.getUserAgent(),
    'Content-Type': 'application/json',
  },
  data: {},
  method: 'POST',
});
export const getCsrfToken = apiInstance
  .post<CsrfTokenResponse>('/api/csrfToken')
  .then(response => {
    console.log(response.data);
    return response.data.data._csrf;
  });

// export const confirmIdToken = async (user: FirebaseAuthTypes.User) => {
//   return apiInstance
//     .post(
//       '/api/signIn',
//       {
//         idToken: await user.getIdToken(),
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         withCredentials: true,
//       },
//     )
//     .then(async result => {
//       console.log('first', result);
//       if (result.data.code === 200) {
//         return apiInstance
//           .post(
//             '/api/auth/signIn',
//             {
//               idToken: await user.getIdToken(true),
//             },
//             {
//               withCredentials: true,
//             },
//           )
//           .then(signInResult => {
//             // console.log('second signIn', signInResult);
//             return signInResult;
//           });
//       }
//     })
//     .catch(error => console.log(error));
// };
// export const uploadMarker = (formData: FormData) => {
//   return apiInstance
//     .post<ResponseFormat>('/api/place/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: progressEvent => onProgress(progressEvent.progress),
//     })
//     .then(result => {
//       onCompleted();
//       return result;
//     });
// };
