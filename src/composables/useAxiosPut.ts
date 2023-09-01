import axios from 'axios'
import { axiosConfigDefault } from "@/composables/axiosConf";


export default function useAxiosPut (path:string,data?:any) {
  return axios.put(path, data, axiosConfigDefault)
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
