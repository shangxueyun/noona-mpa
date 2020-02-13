/**
 *  是否处于可视区域
 *
 * @param {*} el
 * @param {*} wrap
 */
function isVisible (el, wrap) {
  let eh = el.offsetHeight / 2 // 元素的高度
  let et = el.offsetTop // 元素偏移的距离
  let vh = wrap.clientHeight // 元素所在容器的可视高度
  let st = wrap.scrollTop // 元素所在容器的滚动条距离
  let elh = eh + et
  let vht = vh + st
  let isView = (elh > st) && (elh < vht)
  return isView
}

/**
 *  是否要加载
 * @param {*} el
 * @param {*} wrap
 * @returns
 */
function isLoad (el, wrap) {
  let isView = isVisible(el, wrap)
  if (isView) {
    let isPush = parseInt(el.getAttribute('isimg') || 0)
    if (!isPush) {
      el.setAttribute('isimg', 1)
      return true
    } else {
      return false
    }
  }
  return false
}

export default {
  inserted (el, binding, vnode) {
    let wrap = binding.value.wrap
    let imgUrl = el.getAttribute('data-src')
    if (isLoad(el, wrap)) {
      let reg = /^https?:/i
      imgUrl = imgUrl.replace(reg, '')
      el.src = imgUrl
    }
    wrap.addEventListener('scroll', () => {
      if (isLoad(el, wrap)) {
        let reg = /^https?:/i
        imgUrl = imgUrl.replace(reg, '')
        el.src = imgUrl
      }
    }, false)
  }
}
