
const windowWidth = wx.getSystemInfoSync().windowWidth;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0, //选中tab下标
    tabTitles: ["页面1", "页面2", "页面3", "页面4", "页面5", "页面6", "页面7", "页面8", "页面9", "页面10"],
    bodyScrollLeft: 0,
  },
  /**
   * 点击tab
  */
  selectTab: function (e) {
    console.log(e);
    //设置选中样式
    let toIndex = e.currentTarget.dataset.index;
    let fromIndex = this.data.activeTab;
    if (toIndex === fromIndex) {
      return;
    }
    let offSetLeft = e.currentTarget.offsetLeft;
    this.scrollTopBar(offSetLeft, toIndex);
    this.updatePage(fromIndex, toIndex);
  },
  /**
   * 更新展示页面及选中样式
   */
  updatePage: function (fromIndex, toIndex) {
    // body
    let bodyScrollLeft = toIndex * windowWidth;
    this.setData({
      activeTab: toIndex,
      bodyScrollLeft: bodyScrollLeft,
    });
  },
  /**
   * 自适应tabBar选中位置
   */
  scrollTopBar: function (offSetLeft, index) {
    let that = this;
    var nodeId = "#item-" + index;
    wx.createSelectorQuery().select(nodeId).boundingClientRect(function (rect) {
      console.log(rect)
      var res = wx.getSystemInfoSync();
      let targetOffSetLeft = offSetLeft - (res.windowWidth / 2) + (rect.width / 2);
      that.setData({
        scrollLeft: targetOffSetLeft
      });
    }).exec();
  },
  /**
   * 滑动停止
   */
  scrollEnded: function (e) {
    let that = this;
    wx.createSelectorQuery().select('#scroll-view-bodyId').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY']
    }, function (res) {
      let endIndex = Math.round(res.scrollLeft / windowWidth);
      that.updatePage(that.activeTab, endIndex);
      wx.createSelectorQuery().selectAll('.scroll-header-item-wraper').boundingClientRect(function (rects) {
        var offsetLeft = 0;
        for (var i = 0; i < endIndex; i++) {
          offsetLeft += rects[i].width;
        }
        console.log(offsetLeft);
        that.scrollTopBar(offsetLeft, endIndex);
      }).exec();
    }).exec();
  }
})
