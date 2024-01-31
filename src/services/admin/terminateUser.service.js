import axios from "axios";
import { APIURL } from "../../constants/config";
import { authHeader } from "../../helpers";

export const terminateUser = async (data) => {
  try {
    const axiosConfig = {
      method: 'post',
      url: APIURL + "users/terminate",
      data:data,
      headers: { ...authHeader(), "Content-Type": "application/json" },
    };
   const response= await  axios(axiosConfig);
    const result = response;
    if (result) {
      return result;
    }
  } catch (error) {
    if(error?.response?.data)
      return error?.response?.data;
  }
};

export const terminateList = async (page,search) => {
  try{
    const axiosConfig = {
      method: 'post',
      url: APIURL + "users/getTerminateUsers",
      data:{search, page: page, limit: 10},
      headers: { ...authHeader(), "Content-Type": "application/json" },
    };
   const response= await  axios(axiosConfig);
       console.log("terminateList",response);
      if (response) {
      return response;
    }
    
  }catch(error){
      if(error?.response?.data)
      return error?.response?.data;
  }
  // console.log("page",page);
  // try {
  //   const response = await axios.post(APIURL + "users/getTerminateUsers",{search, page: page, limit: 10});
  //   console.log("terminateList",response);
  //   if (response) {
  //     return response;
  //   }
  // } catch (error) {
  //   if(error?.response?.data)
  //     return error?.response?.data;
  // }


};

// export const terminateForever = async (id) => {
//   // console.log(999,id);
//   try {
//     const response = await axios.post(APIURL + "users/terminate", {userId:id,date:"03/07/2023",reason:"hello world check"});
//     const result = await response.data;
//     if (result) {
//       return result;
//     }
//   } catch (error) {
//     if(error?.response?.data)
//       return error?.response?.data;
//   }
// };