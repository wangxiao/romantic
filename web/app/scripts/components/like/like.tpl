<template id="like-tpl">
  <img class="weixin-image" v-if="userInfo.photoUrl" v-bind:src="userInfo.photoUrl">
  <!-- <img class="weixin-image" src="./images/logo.png"> -->
  <div class="m-like">
    <div class="user-info">
      <div v-if="userInfo.photoUrl" class="photo" v-bind:style="{'background-image': 'url(' + userInfo.photoUrl + ')'}"></div>
      <div class="words">
        <div class="name">{{userInfo.name}}</div>
        <div class="tips" v-if="!ui.isSelf">当你喜欢的人也喜欢你时，你们会收到短信通知哟。喜欢 Ta 就表白吧！</div>
        <div class="tips" v-if="ui.isSelf">分享到微信群或者朋友圈中，看看能收多多少表白。当你喜欢的人也喜欢你时，你们会收到短信通知哟。</div>
      </div>
    </div>
    <div class="tools">
      <div class="tips" v-if="!ui.isSelf">参与后可看到{{userInfo.name}}已被表白的人数</div>
      <div class="tips" v-if="ui.isSelf">当前有 {{userInfo.likedCount}} 个人喜欢着你，收到了 {{userInfo.unlikedCount}} 张好人卡</div>
      <div class="btns">
        <div v-if="!ui.isSelf" class="btn like-btn" v-on:click="like();">
          <div class="heart-button" v-bind:class="{play: ui.isLike}"></div>
        </div>
        <div v-if="!ui.isSelf" class="btn unlike-btn" v-on:click="unlike();">Ta 是个好人</div>
        <div v-if="ui.isSelf" class="btn back-btn" v-on:click="back();">返回修改</div>
        <div v-if="ui.isSelf" class="btn share-btn" v-on:click="share();">立即分享</div>
      </div>
    </div>
    <div class="share-cover" v-if="ui.showShare" v-on:click="unshare();">
      <div class="arrow"></div>
      <div class="words">
        <p>点击右上角的三个点，</p>
        <p>分享到朋友圈或微信群。</p>
      </div>
    </div>
  </div>
  <div v-if="ui.showConfirm" class="toast">
    <div class="body">
      <div class="icon"></div>
      <div class="title">每个人最多只能向 3 个人表白，你愿意向 Ta 表白吗？</div>
      <div class="btns">
        <div class="btn back-btn" v-on:click="closeConfirm()">反悔</div>
        <div class="btn submit-btn" v-on:click="confirm()">我愿意</div>
      </div>
    </div>
  </div>
</template>
