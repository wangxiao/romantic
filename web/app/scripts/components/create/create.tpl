<template id="create-tpl">
  <img class="weixin-image" src="./images/logo.png">
  <div class="m-create">
    <div v-if="ui.isSelf" class="header">
      <p class="title">填写信息，看看多少人向你表白</p>
      <p>当你喜欢的人也喜欢你时，你们会收到短信通知，快去寻找真爱吧</p>
    </div>
    <div v-if="!ui.isSelf" class="header">
      <div v-if="otherInfo.photoUrl" class="photo" v-bind:style="{'background-image': 'url(' + otherInfo.photoUrl + ')'}"></div>
      <p class="otherUser-tips">共有 {{otherInfo.likedCount || 1}} 个人偷偷喜欢着 {{otherInfo.name}}，但也有 {{otherInfo.unlikedCount || 1}} 个人说 Ta 是个好人。</p>
    </div>
    <div v-if="!ui.isSelf" class="create-tips">
      <p>填写信息，看看多少人向你表白？</p>
      <p>当你喜欢的人也喜欢你时，你们会收到短信通知，快去寻找真爱吧！</p>
    </div>
    <div class="form">
      <div class="upload-btn">
        <span v-if="!ui.uploading">+</span>
        <span v-if="!ui.uploading" class="upload-word">上传照片</span>
        <span v-if="ui.uploading" class="upload-loading">上传中...</span>
        <form id="upload-file-form" class="upload" enctype="multipart/form-data">
          <input name="attachment" type="file" accept="image/gif, image/jpeg, image/png" v-on:change="uploadPhoto()">
        </form>
        <div class="preview" v-bind:style="{'background-image': 'url(' + userInfo.photoUrl + ')'}"></div>
      </div>
      <div class="line">
        <input class="input" type="text" placeholder="姓名" v-model="userInfo.name">
      </div>
      <div class="line">
        <input class="input" type="number" placeholder="手机号码" v-model="userInfo.phone">
      </div>
      <div class="btn big-btn create-btn" v-on:click="showConfirm()">立即查看</div>
    </div>
    <div class="tooltip" v-bind:class="{hide: !tipWord}">{{tipWord}}</div>
  </div>
  <div v-if="ui.showConfirm" class="toast">
    <div class="body">
      <div class="icon"></div>
      <div class="title">请确认你的手机号</div>
      <div class="content">当你喜欢的人也喜欢你时，你们会收到短信通知。手机号码填错，可能会错过真爱哟！</div>
      <div class="btns">
        <div class="btn back-btn" v-on:click="closeConfirm()">修改</div>
        <div class="btn submit-btn" v-on:click="confirm()">确认</div>
      </div>
    </div>
  </div>
</template>
