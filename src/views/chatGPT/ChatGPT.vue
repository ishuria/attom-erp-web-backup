<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script lang="ts" setup>
  import { useUserStore } from '/@/store/modules/user'
  import { ElScrollbar } from 'element-plus'
  import dayjs from 'dayjs'

  const userStore = useUserStore()
  const { avatar, username } = storeToRefs(userStore)
  const value = ref('')
  const textareaRef = ref()
  const innerRef = ref<HTMLDivElement>()
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  const $baseMessage: any = inject('$baseMessage')

  const list: any = ref([
    {
      type: 'he',
      result:
        'Shop Vite \u6f14\u793a\u5730\u5740\u4ec5\u63d0\u4f9b ' +
        'chatGPT \u57fa\u7840\u80fd\u529b\u5c55\u793a\uff0c\u5982\u9700\u83b7\u53d6 ' +
        'chatGPT \u5b8c\u6574\u529f\u80fd\u8bf7\u8bbf\u95ee ' +
        'open AI \u5b98\u7f51\u81ea\u884c\u8d2d\u4e70\u5bf9\u63a5\uff0c\u60a8\u73b0\u5728\u53ef\u4ee5\u8ddf\u6211\u5bf9\u8bdd\u4e86\u3002',
      avatar: 'static/img/chatGPT.png',
      username: 'chatGPT',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  ])

  onMounted(() => {
    textareaRef.value.focus()
  })
  const send = () => {
    if (!value.value) {
      $baseMessage('提交内容不能为空', 'error', 'vab-hey-message-error')
      return
    }

    const newList = list.value

    newList.push(
      {
        type: 'mine',
        result: value.value,
        avatar: avatar,
        username: username,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        type: 'he',
        result: 'chatGPT AI 内' + '容生成中，请稍后。。。',
        avatar: 'static/img/chatGPT.png',
        username: 'chatGPT',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
    )

    setTimeout(() => {
      value.value = ''
      scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight - 380)
    }, 0)

    axios
      .get(`https://api.pearktrue.cn/api/gpt/?message=${value.value}`)
      .then(({ data: { answer } }) => {
        newList.pop()
        newList.push({
          type: 'he',
          result: answer,
          avatar: 'static/img/chatGPT.png',
          username: 'chatGPT',
          time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight - 380)
      })
  }
</script>

<template>
  <div class="chat-GPT-container">
    <el-row :gutter="20">
      <el-col :lg="14" :md="24" :sm="24" :xl="14" :xs="24">
        <vab-card shadow="never">
          <div class="vab-chat-main">
            <el-scrollbar ref="scrollbarRef">
              <ul ref="innerRef">
                <template v-for="(item, index) in list" :key="index">
                  <li :class="item.type == 'mine' ? 'vab-chat-mine' : ''">
                    <div class="vab-chat-user">
                      <img :src="item.avatar" />
                      <cite>
                        {{ item.username }}
                        <i>{{ item.time }}</i>
                      </cite>
                    </div>
                    <div class="vab-chat-text">{{ item.result }}</div>
                  </li>
                </template>
              </ul>
            </el-scrollbar>
          </div>
          <div class="vab-chat-footer">
            <div class="vab-chat-textarea">
              <el-input
                ref="textareaRef"
                v-model="value"
                resize="none"
                show-word-limit
                type="textarea"
                @keyup.enter="send"
              />
            </div>
            <div class="vab-chat-send">
              <el-button type="primary" @click="send">发送</el-button>
            </div>
          </div>
        </vab-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  $color_1: #999;
  $color_2: #333;
  $color_3: var(--el-color-primary);
  $color_4: #fff;
  $background-color_1: #e2e2e2;
  $background-color_2: #333;
  $background-color_3: var(--el-color-primary);
  $border-color_1: #e2e2e2 transparent transparent;
  $border-top-color_1: var(--el-color-primary);

  .chat-GPT-container {
    padding: 0 !important;
    background: $base-color-background !important;
    :deep() {
      .el-card__body {
        position: relative;
        min-height: calc($base-keep-alive-height - 20px);
      }
    }
    .vab-chat-main {
      height: calc($base-keep-alive-height - 230px);
      ul {
        padding: 5px 25px 15px 5px;
        li {
          position: relative;
          min-height: 68px;
          padding-left: 60px;
          margin-bottom: 10px;
          font-size: 0;
        }

        .vab-chat-text {
          position: relative;
          display: inline-block;
          *display: inline;
          max-width: 462px\9;
          padding: 8px 15px;
          margin-top: 20px;
          font-size: 14px;
          line-height: 22px;
          color: $color_2;
          word-break: break-all;
          vertical-align: top;
          *zoom: 1;
          background-color: $background-color_1;
          border-radius: 5px;
          &:after {
            position: absolute;
            top: 13px;
            left: -10px;
            width: 0;
            height: 0;
            overflow: hidden;
            content: '';
            border-color: $border-color_1;
            border-style: solid dashed dashed;
            border-width: 10px;
          }
          a {
            color: $color_3;
          }
          img {
            max-width: 100%;
            vertical-align: middle;
          }
        }
        .vab-chat-user {
          position: absolute;
          left: 3px;
          display: inline-block;
          *display: inline;
          font-size: 14px;
          vertical-align: top;
          *zoom: 1;
          img {
            width: 40px;
            height: 40px;
            border-radius: 100%;
          }
          cite {
            position: absolute;
            top: -5px;
            left: 60px;
            width: 500px;
            font-size: 12px;
            font-style: normal;
            line-height: 24px;
            color: $color_1;
            text-align: left;
            white-space: nowrap;
            i {
              padding-left: 5px;
              font-style: normal;
            }
          }
        }
        .vab-chat-mine {
          padding-right: 60px;
          padding-left: 0;
          text-align: right;
          .vab-chat-user {
            right: 3px;
            left: auto;
            cite {
              right: 60px;
              left: auto;
              text-align: right;
              i {
                padding-right: 5px;
                padding-left: 0;
              }
            }
          }
          .vab-chat-text {
            margin-left: 0;
            color: $color_4;
            text-align: left;
            background-color: $background-color_3;
            &:after {
              right: -10px;
              left: auto;
              border-top-color: $border-top-color_1;
            }
            a {
              color: $color_4;
            }
          }
        }
      }
    }

    .vab-chat-footer {
      position: absolute;
      bottom: 20px;
      width: 100%;
      height: 150px;
      padding-right: 40px;

      :deep() {
        textarea {
          height: 110px;
        }
      }
      .vab-chat-send {
        position: absolute;
        right: 40px;
        margin-top: 15px;
      }
    }
  }
</style>
