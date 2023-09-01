import {useCookies} from "vue3-cookies";

const { cookies } = useCookies();

export const axiosConfigDefault = {
  headers: {
    'Authorization' : `Token ${cookies.get("token")}`
  }
}
