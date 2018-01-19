import $ from 'jquery'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.3): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Button = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'button'
  const VERSION             = '4.0.0-beta.3'
  const DATA_KEY            = 'bs.button'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]

  const ClassName = {
    ACTIVE : 'active',
    BUTTON : 'btn',
    FOCUS  : 'focus'
  }

  const Selector = {
    DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
    DATA_TOGGLE        : '[data-toggle="buttons"]',
    INPUT              : 'input',
    ACTIVE             : '.active',
    BUTTON             : '.btn'
  }

  const Event = {
    CLICK_DATA_API      : `click${EVENT_KEY}${DATA_API_KEY}`,
    FOCUS_BLUR_DATA_API : `focus${EVENT_KEY}${DATA_API_KEY} ` +
                            `blur${EVENT_KEY}${DATA_API_KEY}`
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button {
    constructor(element) {
      this._element = element
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    // Public

    toggle() {
      /**
       * 看完代码发现支持单选框的按钮组
       * 
       * 如果是单个按钮的话调用toggle会在激活和未激活状态之间切换
       * 如果是在按钮组中的就不会了，只会从未激活到激活，如果是在激活状态调用toggle没有任何作用
       */
      let triggerChangeEvent = true
      let addAriaPressed = true
      const rootElement = $(this._element).closest(
        Selector.DATA_TOGGLE
      )[0]//按钮组容器结点

      if (rootElement) {//如果有容器结点
        const input = $(this._element).find(Selector.INPUT)[0]//找出当前按钮里面的input元素

        if (input) {
          if (input.type === 'radio') {//单选
            if (input.checked &&
              $(this._element).hasClass(ClassName.ACTIVE)) {//选中状态
              triggerChangeEvent = false
            } else {//未选中状态
              const activeElement = $(rootElement).find(Selector.ACTIVE)[0]//找到按钮组中的选中的那一个

              if (activeElement) {//把选中的那一个的active状态干掉
                $(activeElement).removeClass(ClassName.ACTIVE)
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') ||
              rootElement.hasAttribute('disabled') ||
              input.classList.contains('disabled') ||
              rootElement.classList.contains('disabled')) {
              return//disabled状态直接返回
            }
            input.checked = !$(this._element).hasClass(ClassName.ACTIVE)//设置checked属性
            $(input).trigger('change')//触发change事件
          }

          input.focus()
          addAriaPressed = false
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed',
          !$(this._element).hasClass(ClassName.ACTIVE))
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName.ACTIVE)
      }
    }

    dispose() {
      //删除该插件使用的数据，并把_element指向null，在c/c++中是防止野指针
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // Static
    //这块应该是标准的，唯一的变化，我觉得应该是config判断那句，有的插件暴露的方法比较多
    //我认为完全可以写一个通用的
    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)

        if (!data) {
          data = new Button(this)
          $(this).data(DATA_KEY, data)
        }

        if (config === 'toggle') {//只提供了toggle
          data[config]()
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      event.preventDefault()

      let button = event.target

      if (!$(button).hasClass(ClassName.BUTTON)) {
        button = $(button).closest(Selector.BUTTON)
      }

      Button._jQueryInterface.call($(button), 'toggle')
    })
    .on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      const button = $(event.target).closest(Selector.BUTTON)[0]
      $(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type))
    })

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Button._jQueryInterface
  $.fn[NAME].Constructor = Button//我一直以来都不太了解这句想干什么
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Button._jQueryInterface
  }

  return Button
})($)

export default Button
/**
 * 我要走出自己的前端之路
 * 我不要做一个平庸的前端
 */