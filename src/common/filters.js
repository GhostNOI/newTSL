import {FormatDate} from './utils.js'
import {PrefixDate} from "./utils";

export const filterAttrGroup = (value, id, values) => {
  if (value === '') {
    return ''
  }
  if (id == '88') {
    const arr = values[id];
    const newVal = value.map((item) => {
      return arr.find(arrItem => arrItem.id == item).attr_value
    })
    return newVal.join();
  }
  const filterObj = store.state.roster.attrGroup.find(item => item.id == id);
  if (value instanceof Array) {
    const arr = [];
    value.forEach((item, i) => {
      arr.push(filterObj.attrValues.find(items => items.id == item).attr_value)
    })
    return arr.join()
  } else {
    const obj = filterObj.attrValues.find(item => item.id == value);
    if (typeof obj == 'undefined') {
      throw `attr_id为${id}的数据报错`
    }
    return obj.attr_value;
  }
}

export const formatEntryTable = (value, attr_type) => {
  if (value === '') {
    return ''
  }
  if (attr_type === 13) {
    if (value == 'Array') {
      return '';
    }
    return JSON.parse(value).value.join();
  }
  if (attr_type === 15) {
    return JSON.parse(value).path;
  }
  return value;
}

export const formatRoster = (value, attr_type) => {
  if (value === '' || (value instanceof Array && value.length === 0)) {
    return ''
  }
  if (attr_type === 13) {
    return value.value.join();
  }
  if (attr_type === 15) {
    return value.path;
  }
  return value;
}

export const formatTime = (value, attr_type) => {
  if (value === '') {
    return '';
  }
  if (attr_type === 6) {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    const time = new Date(`${year}-${month}-01 00:00:00`).getTime();
    return time;
  }
  if (attr_type === 7) {
    const year = value.split('-')[0];
    const month = value.split('-')[1];
    const day = value.split('-')[2];
    const time = new Date(`${year}-${month}-${day} 00:00:00`).getTime();
    return time;
  }
  if (attr_type === 11) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const hour = value.split(':')[0];
    const minute = value.split(':')[1];
    const time = new Date(`${year}-${month}-${day} ${hour}:${minute}:00`).getTime();
    return time;
  }
}

// export const formatDate = (dateTime,format = 'YYYY-MM-DD HH:mm' ) => {
//   return FormatDate(dateTime,format = 'YYYY-MM-DD HH:mm')
// }

export const transformDate = (time) => {
  if(!time) {
    return ''
  }else {
    const date = new Date(time*1000)
    const dateNumFun = (num) => num < 10 ? `0${num}` : num
    const [Y, M, D, h, m, s] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds())
    ]
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
}

export const dateFilter = (time) => {
  if(!time) {
    return ''
  }else {
    const date = new Date(time*1000)
    const dateNumFun = (num) => num < 10 ? `0${num}` : num
    const [Y, M, D, h, m, s] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds())
    ]
    // return `${Y}-${M}-${D} ${h}:${m}:${s}`
    return `${Y}-${M}-${D}`
  }
}

export const isOnline = (status) => {
  if(+status === 1){
    return '在线'
  }else{
    return '离线'
  }
}

export const triggerLevel = (level) => {
  if(+level === 1){
    return '灾难'
  }else if(+level === 2){
    return '严重'
  }else if(+level === 3){
    return '警告'
  }else if(+level === 4){
    return '信息'
  }
}

export const threshold = (threshold) => {
  return threshold
}

export const  noticeType = (noticeType) => {
  if(noticeType == 1){
    return '平台弹窗'
  }else if(noticeType == 2){
    return '钉钉'
  }else if(noticeType == 3){
    return '短信'
  }else if(noticeType == 4){
    return '邮箱'
  }
}

export const noticeClass = (noticeClass) => {
  if(+noticeClass === 1){
    return '催办'
  }else if(noticeClass){
    return '预警'
  }
}

export const eventType = (eventType) =>{
  if(eventType == 1){
    return '服务器'
  }if(eventType == 2){
    return '数据库'
  }if(eventType == 3){
    return '应用服务'
  }if(eventType == 4){
    return '设备'
  }if(eventType == 5){
    return '安全'
  }
}

export const isOrNot = (isOrNot) => {
  if(isOrNot == 0){
    return '无'
  }else if(isOrNot == 1){
    return '有'
  }
}

export const deviceType = (deviceType) => {
  if(+deviceType === 0){
    return '普通'
  }else if(+deviceType === 1){
    return '人脸抓拍'
  }
}

export const formatSec = (formatSec) => {
  let h = Math.floor(formatSec / 3600) < 10 ? '0'+Math.floor(formatSec / 3600) : Math.floor(formatSec / 3600);
  let m = Math.floor((formatSec / 60 % 60)) < 10 ? '0' + Math.floor((formatSec / 60 % 60)) : Math.floor((formatSec / 60 % 60));
  let s = Math.floor((formatSec % 60)) < 10 ? '0' + Math.floor((formatSec % 60)) : Math.floor((formatSec % 60));
  return formatSec = h + ":" + m + ":" + s;
}


export const toChinese = (toChinese) => {
  if(toChinese === 'service'){
    return '服务器'
  }else if(toChinese === 'dataBase'){
    return '数据库'
  }else if(toChinese === 'application'){
    return '应用服务'
  }else if(toChinese === 'device'){
    return '智能设备'
  }else if(toChinese === 'security'){
    return '安全'
  }
}
