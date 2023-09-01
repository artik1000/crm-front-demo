import axios from 'axios'
import { axiosConfigDefault } from "@/composables/axiosConf";


export default function useAxiosDelete (path:string) {
  return axios.delete(path, axiosConfigDefault)
    .then(response => {
      return {
        response: response,
        success: true,
        error: false
      }
    })
    .catch(error => {
      console.error(error);
      return {
        success: false,
        error: true
      }
    });
}
