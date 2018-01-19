import $ from 'jquery'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.3): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Alert = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  /*
  插件的名称、版本、数据键、事件键等
  */

  const NAME                = 'alert'
  const VERSION             = '4.0.0-beta.3'
  const DATA_KEY            = 'bs.alert'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150

  const Selector = {
    DISMISS : '[data-dismiss="alert"]'
  }

  const Event = {
    CLOSE          : `close${EVENT_KEY}`,
    CLOSED         : `closed${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    ALERT : 'alert',
    FADE  : 'fade',
    SHOW  : 'show'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert {
    constructor(element) {
      this._element = element
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    // Public

    close(element) {
      element = element || this._element

      const rootElement = this._getRootElement(element)//找到.alert结点
      const customEvent = this._triggerCloseEvent(rootElement)

      if (customEvent.isDefaultPrevented()) {//如果close.bs.alert处理函数中调用了preventDefault则直接返回
        return
      }

      this._removeElement(rootElement)
    }

    dispose() {
      /**
       * 销毁就是把插件在元素上放置的data移除掉
       */
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // Private

    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element)//获取element的data-target或href指向的元素的选择符
      let parent     = false

      if (selector) {//有target
        parent = $(selector)[0]
      }

      if (!parent) {//没有则往上找.alert的元素
        parent = $(element).closest(`.${ClassName.ALERT}`)[0]
      }

      return parent
    }

    _triggerCloseEvent(element) {
      const closeEvent = $.Event(Event.CLOSE)//创建一个close的事件

      $(element).trigger(closeEvent)//触发close事件
      return closeEvent
    }

    _removeElement(element) {
      $(element).removeClass(ClassName.SHOW)//移除show类

      if (!Util.supportsTransitionEnd() ||
          !$(element).hasClass(ClassName.FADE)) {//判断是否需要过渡效果，没有则就直接移除元素
        this._destroyElement(element)
        return
      }

      $(element)
        .one(Util.TRANSITION_END, (event) => this._destroyElement(element, event))
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    _destroyElement(element) {
      /**
       * detach跟remove效果差不多，区别在于detach的元素会保留其上的data属性，而remove则不会
       * 我只是不明白这里为什么后面有了remove还要detach呢？
       */
      $(element)
        .detach()
        .trigger(Event.CLOSED)
        .remove()
    }

    // Static
    static _jQueryInterface(config) {
      /**
       * 插件注册的方法
       * 
       * $.fn.pluginName = function(){
       *  return this.each(function(){
       *    xxx
       *  });
       * };
       */
      return this.each(function () {
        const $element = $(this)
        let data       = $element.data(DATA_KEY)

        if (!data) {
          data = new Alert(this)
          $element.data(DATA_KEY, data)
        }

        if (config === 'close') {//只提供了close方法
          data[config](this)
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault()
        }

        alertInstance.close(this)
      }
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(
    Event.CLICK_DATA_API,
    Selector.DISMISS,
    Alert._handleDismiss(new Alert())
  )

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Alert._jQueryInterface
  $.fn[NAME].Constructor = Alert
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Alert._jQueryInterface
  }

  return Alert
})($)

export default Alert
