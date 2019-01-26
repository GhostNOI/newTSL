const BASE_API = process.env.BASE_API;
const DOMAIN_NAME = process.env.DOMAIN_NAME;
const COOKIS_NAME = process.env.COOKIS_NAME;

// 判断是否是相对路径
export const isAbsoluteUrl =  (url) => {
  const absolutePattern = /^https?:\/\//i;
  return absolutePattern.test(url);
};

// 为相对路径添加BASE_API
export const prepareUrl = (url) => {
  url = isAbsoluteUrl(url) ? url : `${BASE_API}/${url}`;
  return url.replace(/([^:]\/)\/+/g, '$1');
};


// 月日单数字显示成双数字
export const PrefixDate = (time) => {
  time = Number(time);
  return time < 10 ? '0' + time : time;
};

// 日期转换， dateTime为时间，时间戳，格林威治时间,字符串都可以, format为格式化的格式，默认"YYYY-MM-DD HH:mm"
export const FormatDate = (dateTime, format = 'YYYY-MM-DD HH:mm') => {
  dateTime = isNaN(Number(dateTime)) ? dateTime : Number(dateTime);

  if (typeof dateTime === 'string') {
    dateTime = dateTime.replace(/\-/g, '/');
    dateTime = new Date(dateTime);
  } else if (typeof dateTime === 'number') {
    dateTime = new Date(dateTime);
  } else if (!(dateTime instanceof Date)) {
    dateTime = new Date();
  }

  const week = ['日', '一', '二', '三', '四', '五', '六'];
  return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|SS|ss|week/g, function(key) {
    switch (key) {
      case 'YYYY':
        return dateTime.getFullYear();
      case 'YY':
        return(dateTime.getFullYear() + '').slice(2);
      case 'MM':
        return PrefixDate(dateTime.getMonth() + 1);
      case 'DD':
        return PrefixDate(dateTime.getDate());
      case 'HH':
      case 'hh':
        return PrefixDate(dateTime.getHours());
      case 'mm':
        return PrefixDate(dateTime.getMinutes());
      case 'SS':
      case 'ss':
        return PrefixDate(dateTime.getSeconds());
      case 'week':
        return week[dateTime.getDay()];
    }
  });
};



// 设置cookie, expiredays有效天数
export const setCookie = (value, key = 'tsl_token', expiredays = 30) => {
  value = encodeURIComponent(value);
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  exdate = exdate.toGMTString();
  document.cookie = `${key}=${value};expires=${exdate};path=/;`;
};
// 获取cookie
export const getCookie = (key = 'tsl_token') => {
  let reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  let arr = document.cookie.match(reg);
  return arr ? decodeURIComponent(arr[2]) : null;
};
// 清除cookie
export const removeCookie = (key = 'tsl_token') => {
  setCookie(null, key, -30);
};

// // 设置cookie, expiredays有效天数
// export const setCooke = (value, key = COOKIS_NAME, expiredays = 30) => {
//   window.sessionStorage && setStorage(key, value);
//   value = encodeURIComponent(value);
//   let exdate = new Date();
//   exdate.setDate(exdate.getDate() + expiredays);
//   exdate = exdate.toGMTString();
//   document.cookie = `${key}=${value};expires=${exdate};path=/;domain=${DOMAIN_NAME}`;
// };
//
// export const getCookie = (key = COOKIS_NAME) => {
//   if (window.sessionStorage && getStorage(key))  {
//     return getStorage(key);
//   }
//   let reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
//   let arr = document.cookie.match(reg);
//   return arr ? decodeURIComponent(arr[2]) : null;
// };
//
// // 清除cookie
// export const removeCookie = (key = COOKIS_NAME) => {
//   window.sessionStorage && removeStorage(key);
//   setCooke('', key, -30);
// };

export const setStorage = (key, value) => {
  sessionStorage.setItem(key, value);
};

export const getStorage = (key) => {
  return sessionStorage.getItem(key);
};

export const removeStorage = (key) => {
  sessionStorage.removeItem(key);
};

export const neighborTime = (timer) => {
  const timeStr = FormatDate(timer, 'YYYY-MM-DD HH:mm');
  const last = timeStr[timeStr.length - 1];
  let newTimer = null;
  if (+last < 3) {
    newTimer = timer - last*60*1000;
  } else if (last >= 3 && last <= 5) {
    newTimer = timer + (5-last)*60*1000;
  } else if (last > 5 && last < 8) {
    newTimer = timer - (last - 5)*60*1000;
  } else {
    newTimer = timer + (10 - last)*60*1000;
  }
  return newTimer;
}
