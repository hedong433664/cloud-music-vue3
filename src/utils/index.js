import routers from '@/router/router.config'

/**
 * @description 格式化秒数为 mm:ss
 * @param { Number } time
 * @returns { String } mm:ss
 */
export const formatTime = time => {
  if (typeof time !== 'number' || !time) {
    return '00:00'
  }
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * @param {number} dt
 * @returns {string}
 */
export function formatMillisecond(dt){
  if (typeof dt !== 'number' || !dt) {
    return '00:00'
  }
  let seconds = Math.floor(dt / 1000)
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  let result = ''

  if (hours > 0) {
    result += hours.toString().padStart(2, '0') + ':'
  }

  if (minutes > 0 || hours > 0) {
    result += minutes.toString().padStart(2, '0') + ':'
  }
  else {
    result += '00:'
  }

  result += seconds.toString().padStart(2, '0')

  return result
}

/**
 * @description 格式化数量
 * @param {number} count
 * @returns {string}
 */
export function formatCount(count){
  if (!count) {
    return 0
  }
  let str = '' // 存储格式化后的字符串
  // 判断 count 是否大于等于 10000，如果是，则需要加上“万”（除以 10000）
  if (count >= 10000) {
    str = (count / 10000).toFixed(2) + '万'
  }
  else {
    str = count.toString() // 如果小于 10000，则直接使用原始值
  }
  // 判断新的 str 值是否大于等于 10000，如果是，则需要加上“亿”（除以 10000）
  if (parseFloat(str) >= 10000) {
    str = (parseFloat(str) / 10000).toFixed(2) + '亿'
  }
  return str
}

/**
 * @description 函数防抖
 * @param { Function } func 需要防抖的函数
 * @param { Number } wait 延迟执行的时间（单位：毫秒）
 * @returns { Function } 防抖后的函数
 */
export function debounce(func, wait){
  let timeout
  return function(){
    const context = this
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * @description 函数节流
 * @param { Function } func 需要防抖的函数
 * @param { Number } wait 延迟执行的时间（单位：毫秒）
 * @returns { Function } 防抖后的函数
 */
export function throttle(func, wait){
  let timeout
  return function(){
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null // 执行完后，timeout 置为 null
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * @description 设置背景色
 * @param { Array } rgbs 颜色数组
 */
export function setBackground(rgb){
  document.documentElement.style.setProperty('--body-before-opacity', 0)
  if (rgb && rgb.length) {
    let newRgb
    if (isLightColor(rgb)) {
      const [h, s, _l] = rgbToHsl(rgb)
      newRgb = hslToRgb([h, s, 0.2])
    }
    else {
      newRgb = rgb
    }
    document.documentElement.style.setProperty('--c1', `rgb(${newRgb[0]}, ${newRgb[1]}, ${newRgb[2]})`)
  }
  else {
    document.documentElement.style.setProperty('--c1', 'rgb(19, 19, 26)')
  }
}
/**
 * @description 设置背景色
 * @param { Array } rgbs 颜色数组
 * @param { String } position 渐变位置
 */
export function getLinearGradient(rgb, position = 'bottom'){
  const arr = []
  for (let index = 1; index > 0;) {
    if (isLightColor(rgb)) {
      const [h, s, _l] = rgbToHsl(rgb)
      arr.push([...hslToRgb([h, s, 0.2]), index.toFixed(1)])
    }
    else {
      arr.push([...rgb, index.toFixed(1)])
    }
    index -= 0.4
  }

  let rgbMap = []

  if (position === 'bottom' || position === 'top') {
    rgbMap = arr.map(rgba => `rgba(${rgba.join(', ')})`)
  }
  else {
    arr.forEach(rgba => rgbMap.unshift(`rgba(${rgba.join(', ')})`))
  }

  return `linear-gradient(to ${position}, ${rgbMap.join(', ')})`
}

// 是否为亮色
function isLightColor([r, g, b]){
  // 转换为HSL
  const [_h, _s, l] = rgbToHsl([r, g, b])
  // 如果亮度大于0.5，则认为是亮色
  return l >= 0.5 || l <= 0.2
}

function hslToRgb([h, s, l]){
  function hue2Rgb(p, q, t){
    if (t < 0) {
      t += 1
    }
    if (t > 1) {
      t -= 1
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
      return q
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = hue2Rgb(p, q, h + 1 / 3)
  const g = hue2Rgb(p, q, h)
  const b = hue2Rgb(p, q, h - 1 / 3)

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function rgbToHsl([r, g, b]){
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    // eslint-disable-next-line default-case
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g: h = (b - r) / d + 2
        break
      case b: h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

// 获取路由缓存cachedViews
export function getCachedViews(){
  const cachedViews = []
  routers.forEach(item => {
    if (item.meta && item.meta.keepAlive) {
      cachedViews.push(item.name)
    }
    if (item.children && item.children.length) {
      item.children.forEach(child => {
        if (child.meta && child.meta.keepAlive) {
          cachedViews.push(child.name)
        }
      })
    }
  })
  return cachedViews
}

