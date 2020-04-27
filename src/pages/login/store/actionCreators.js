import axios from 'axios'
import * as constants from './constants'

export const exchangeLogin = () => {
  return {
    type: constants.CHANGE_LOGIN,
  }
}

//react-thunk扩展了redux的能力，使得redux可以发送axios请求
// export const login=(account,password)=>{
// 	return (dispatch)=>{
// 		axios.get('')
// 		.then((res)=>{
// 		    const result =res.data.data;
// 		    if(result){
//                dispatch(changeLogin(result,account))
// 		    }
// 		    else{
// 		    	alert('登录失败')
// 		    }
// 		})
// 	}
// }
