<template>
  <div
    class="m-video"
    :class="{'u-video-hover': !hidden}"
  >
    <video
      ref="veo"
      class="video"
      :style="`object-fit: ${zoom};`"
      :src="src"
      :poster="veoPoster"
      :autoplay="autoplay"
      :controls="!originPlay&&controls"
      :loop="loop"
      :muted="autoplay || muted"
      :preload="preload"
      crossorigin="anonymous"
      @pause="showPlay ? onPause() : () => false"
      @playing="showPlay ? onPlaying() : () => false"
      @click.prevent.once="onPlay"
      v-bind="$attrs"
    >您的浏览器不支持video标签。</video>
    <svg
      v-show="originPlay || showPlay"
      class="u-play"
      :class="{'hidden': hidden}"
      :style="`width: ${playWidth}rem; height: ${playWidth}rem;`"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M15.25 12L9.75 8.75V15.25L15.25 12Z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "Video",
  props: {
    src: {
      type: String,
      required: true,
      default: ""
    },
    poster: {
      type: String,
      default: ""
    },
    second: {
      type: Number,
      default: 0.5
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 450
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    },
    preload: {
      type: String,
      default: "auto"
    },
    showPlay: {
      type: Boolean,
      default: true
    },
    playWidth: {
      type: Number,
      default: 96
    },
    zoom: {
      type: String,
      default: "contain"
    }
  },
  data() {
    return {
      veoPoster: this.poster,
      originPlay: true,
      hidden: false
    };
  },
  mounted() {
    this.getPoster()
    if (this.autoplay) {
      this.hidden = true;
      this.originPlay = false;
    }
  },
  methods: {
    getPoster() {
      this.$refs.veo.currentTime = this.second;
      // 创建canvas元素
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // canvas画图
      canvas.width = this.$refs.veo.videoWidth;
      canvas.height = this.$refs.veo.videoHeight;
      ctx.drawImage(this.$refs.veo, 0, 0, canvas.width, canvas.height);
      // 把canvas转成base64编码格式
      this.veoPoster = canvas.toDataURL("image/png");
    },
    onPlay() {
      if (this.originPlay) {
        this.$refs.veo.currentTime = 0;
        this.originPlay = false;
      }
      if (this.autoplay) {
        this.$refs.veo.pause();
      } else {
        this.hidden = true;
        this.$refs.veo.play();
      }
    },
    onPause() {
      this.hidden = false;
    },
    onPlaying() {
      this.hidden = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.video{
    height: 100%;
    width: 100%;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.m-video {
  width: 100%;
  height: 100%;
  display: inline-block;
  position: relative;
  background: #000;
  cursor: pointer;
  .u-play {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    fill: none;
    color: #fff;
    pointer-events: none;
    opacity: 0.7;
    transition: opacity 0.3s;
    path {
      stroke: #fff;
    }
  }
  .hidden {
    opacity: 0;
  }
}
.u-video-hover {
  &:hover {
    .u-play {
      opacity: 0.9;
    }
  }
}

//全屏按钮
// video::-webkit-media-controls-fullscreen-button {
//   display: none;
// }
//播放按钮
video::-webkit-media-controls-play-button {
  // display: none;
}
//进度条
video::-webkit-media-controls-timeline {
  // display: none;
}
//观看的当前时间
video::-webkit-media-controls-current-time-display {
  // display: none;
}
//剩余时间
video::-webkit-media-controls-time-remaining-display {
  // display: none;
}
//音量按钮
video::-webkit-media-controls-mute-button {
  display: none;
}
</style>