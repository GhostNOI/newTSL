import axios from 'axios'
import qs from 'qs'
import {Loading, Message} from "element-ui";
import {prepareUrl, getCookie, removeCookie,setCookie} from '../common/utils'
import {getStorage, removeStorage} from './utils';
import router from '../router/index'


let loadingNum = 0; // 某周期内请求次数
let loadingInstance = null; // loading实例
let isError = false;  // 是否报错

const instance = axios.create({});

const instanceWithoutLoading = axios.create({});


// 关闭loading
const closeLoading = () => {
  loadingInstance && loadingInstance.close();
  loadingInstance = null;
  loadingNum = 0;
};

// 显示loading
export const showLoading = () => {
  const IS_HIDE_LOADING = getStorage('HIDE_LOADING');
  if (!IS_HIDE_LOADING) {
    loadingNum++;
    if (loadingNum === 1 && !loadingInstance && !isError) {
      loadingInstance = Loading.service({fullscreen: true});
    }
  }
};

// 隐藏loading
export const hideLoading = () => {
  const IS_HIDE_LOADING = getStorage('HIDE_LOADING');
  if (!!IS_HIDE_LOADING) {
    removeStorage('HIDE_LOADING')
  } else {
    loadingNum--;
    if (loadingNum <= 0 || isError) {
      closeLoading();
    }
  }

};


// http request 拦截器
[instance, instanceWithoutLoading].forEach((i, index) => {
  i.interceptors.request.use(
    config => {
      config.url = prepareUrl(config.url);
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      const token = getCookie();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      let dateNow = Date.now();
      let date = dateNow - window.localStorage.getItem('insertTime')*1000;
      // console.log(date, 'date');
      if(date > 6900000 && date < 7200000){
        window.localStorage.setItem('insertTime', date*1000000);
        post('/Manage/Login/GetNewToken',{})
          .then((data) => {
            // console.log(data);
            setCookie('tsl_token');
            // console.log('重新请求token');
            window.localStorage.setItem('insertTime',data.Data.toeknTime)
            // console.log(window.localStorage.getItem('insertTime'));
          })
      }

      // index == 0 && showLoading();
      return config
    },
    err => {
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
        if(!window.localStorage.getItem('userId')){
          logout()
        }else if(+res.data.ErrorCode === 0){
          if(+res.data.Data.code < 0){
            // console.log('aa');
            logout()
          }else if(+res.data.Data.code === 99){
            router.push('/notfound')
          }
        }

          return res.data;
        // }
      },
      error => {
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
