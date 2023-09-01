import axios from 'axios'
import { axiosConfigDefault } from "@/composables/axiosConf";

let loading = true

let responseData = []

let pagesValue = 1

export default function useAxiosGet (path:string,request?:any) {
  return axios.get(path,axiosConfigDefault).then(response => {
    if (response.data.results){
      responseData = response.data.results
    } else {
      console.error('Response Data is not in result')
    }
    if (response.data.count){
      pagesValue = response.data.count
    }
    if (response.data.buttons_rounded || response.data.image){
      responseData = response.data
    }
    loading = false
    return  {
      items: pagesValue,
      responseData: responseData,
      loading: loading
    }
  }).catch(error => {
    console.error(error)
    return {
      error: true
    }
  })
}
