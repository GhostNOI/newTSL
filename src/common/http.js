import axios from 'axios'
import qs from 'qs'
import {Loading, Message} from "element-ui";
import {prepareUrl, getCookie, removeCookie,setCookie} from '../common/utils'
import {getStorage, removeStorage} from './utils';
import router from '../router/index'


let loadingNum = 0; // 某周期内请求次数
let loadingInstance = null; // loading实例
let timer = null;
const instance = axios.create({method: 'post'});

const instanceWithoutLoading = axios.create({});



// 关闭loading
const closeLoading = () => {
  clearTimeout(timer);
  loadingInstance && loadingInstance.close();
  loadingInstance = null;
  loadingNum = 0;
};

// 显示loading
export const showLoading = () => {
  loadingNum++;
  if (loadingNum === 1 && !loadingInstance) {
    timer = setTimeout(() => {
      loadingInstance = Loading.service({fullscreen: true});
    }, 500);
  }
};

// 隐藏loading
export const hideLoading = () => {
    loadingNum--;
    if (loadingNum <= 0) {
      closeLoading();
    }
};


// http request 拦截器
[instance, instanceWithoutLoading].forEach((i, index) => {
  i.interceptors.request.use(
    config => {
      showLoading();
      config.url = prepareUrl(config.url);
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      const token = getCookie();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      let dateNow = Date.now();
      let date = dateNow - window.localStorage.getItem('insertTime')*1000;
      //重新获取token
      if(date > 6900000 && date < 7200000){
        window.localStorage.setItem('insertTime', date*1000000);
        post('/Manage/Login/GetNewToken',{})
          .then((data) => {
            let token = data.Data.token;
            setCookie(token);
            window.localStorage.setItem('insertTime',data.Data.toeknTime)
          })
      }
      return config
    },
    err => {
      hideLoading();
      return Promise.reject(err)
    }
  )
});



// http response 拦截器
[instance, instanceWithoutLoading].forEach((item, index) => {
    item.interceptors.response.use(
      res => {
        // console.log(res, 111111);
        // 错误处理
        // if (+res.data.Data.code === -4) {
          // alert('用户不存在');
        // } else {
        hideLoading();
        // if(!window.localStorage.getItem('userId')){
        //   logout()
        // }else
        if(+res.data.ErrorCode === 0){
          if(+res.data.Data.code === -1){
            logout()
          }else if(+res.data.Data.code === 99){
            // console.log('aa');
            router.push('/notfound')
          }
        }

          return res.data;
        // }
      },
      error => {
        hideLoading();
        return Promise.reject(error);
      }
    )
  }
);

const post = (url, data) => {
  return instance({
    method: 'post',
    url,
    data: qs.stringify(data)
  })
};
const postWithoutLoading = (url, data ) => {
  return instanceWithoutLoading({
    method: 'post',
    url,
    data: data
  })
};

const get = (url, params) => {
  return instance({
    method: 'get',
    url,
    params
  })
};

const getWithoutLoading = (url, params) => {
  return instanceWithoutLoading({
    method: 'get',
    url,
    params
  })
};

const logout = () => {
  window.localStorage.removeItem('userId');
  window.localStorage.removeItem('insertTime');
  removeCookie();
  router.push('/login');
}

const all = (...req) => {
  if (req.length === 1) {
    req = req[0];
  }
  axios.spread(req);
  return axios.all(req);
};

export default {
  post,
  get,
  getWithoutLoading,
  postWithoutLoading,
  all,
  hideLoading,
  showLoading,
  logout
}
