import {apiInstance} from '@utils/Networking';
import {AxiosError, AxiosResponse} from 'axios';

interface deletePostProps {
  csrfToken: string;
  post: IPost;
  callback: (response: AxiosResponse<response>) => void;
  errorHandle: (error: AxiosError) => void;
}
export const deletePost = ({
  csrfToken,
  post,
  callback,
  errorHandle,
}: deletePostProps) =>
  apiInstance
    .post<response>('/api/post/delete', {_csrf: csrfToken, postId: post._id})
    .then(callback)
    .catch(errorHandle);
