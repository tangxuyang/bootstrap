$(function () {
  'use strict'

  QUnit.module('alert plugin')

  /**
   * alert是jQuery插件，而且是在$.fn上的，因此判断是否任何一个jQuery对象都有这个方法
   */
  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).alert, 'alert method is defined')
  })

  QUnit.module('alert', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapAlert = $.fn.alert.noConflict()
    },
    afterEach: function () {
      $.fn.alert = $.fn.bootstrapAlert
      delete $.fn.bootstrapAlert
    }
  })

  /**
   * 解决冲突后$.fn.alert就被还原回之前的值了，因为在这里之前是没有值的所以结果必然是undefined
   */
  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual(typeof $.fn.alert, 'undefined', 'alert was set back to undefined (org value)')
  })

  /**
   * 要支持连缀功能，alert要返回jQuery对象，同时保证返回的就是原来的结点对象
   */
  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $alert = $el.bootstrapAlert()
    assert.ok($alert instanceof $, 'returns jquery collection')
    assert.strictEqual($alert[0], $el[0], 'collection contains element')
  })

  /**
   * 测试点击close按钮，alert应该关闭，也就是show类不存在
   */
  QUnit.test('should fade element out on clicking .close', function (assert) {
    assert.expect(1)
    var alertHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>'

    var $alert = $(alertHTML).bootstrapAlert().appendTo($('#qunit-fixture'))

    $alert.find('.close').trigger('click')

    assert.strictEqual($alert.hasClass('show'), false, 'remove .show class on .close click')
  })
  /**
   * 点击close后，alert自己remove掉
   */
  QUnit.test('should remove element when clicking .close', function (assert) {
    assert.expect(2)
    var alertHTML = '<div class="alert alert-danger fade show">' +
        '<a class="close" href="#" data-dismiss="alert">×</a>' +
        '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
        '</div>'
    var $alert = $(alertHTML).appendTo('#qunit-fixture').bootstrapAlert()

    assert.notEqual($('#qunit-fixture').find('.alert').length, 0, 'element added to dom')

    $alert.find('.close').trigger('click')

    assert.strictEqual($('#qunit-fixture').find('.alert').length, 0, 'element removed from dom')
  })

  /**
   * 测试在close.bs.alert中阻止关闭，是否能够成功阻止
   */
  QUnit.test('should not fire closed when close is prevented', function (assert) {
    assert.expect(1)
    var done = assert.async()
    $('<div class="alert"/>')
      .on('close.bs.alert', function (e) {
        e.preventDefault()
        assert.ok(true, 'close event fired')
        done()
      })
      .on('closed.bs.alert', function () {
        assert.ok(false, 'closed event fired')
      })
      .bootstrapAlert('close')
  })
})
/**
 * 单元测试也不难，只要思路清晰是可以写出来的，加油！
 * 要单元测试就必须保证有单元，如果代码一团乱麻，没有章法，怎么单元测试！
 */