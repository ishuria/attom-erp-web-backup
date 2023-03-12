<script lang="ts" setup>
  onMounted(() => {
    nextTick(() => {
      const h5: any = document.querySelector('h5')
      h5.innerHTML = h5.textContent
        .replace(/\S/g, '<span>$&</span>')
        .replace(/\s/g, '<span>&nbsp;</span>')

      let delay = 0
      document.querySelectorAll('span').forEach((span, index) => {
        delay += 0.1

        if (index === 6) delay += 0.3

        span.style.setProperty('--delay', `${delay}s`)
      })

      h5.addEventListener('animationend', (e: { target: Element | null }) => {
        if (e.target === document.querySelector('h5 span:last-child')) {
          h5.classList.add('ended')
        }
      })
    })
  })
</script>

<template>
  <div class="page-banner">
    <el-carousel height="145px">
      <el-carousel-item>
        <h5>四年坚守，感恩有你！</h5>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style lang="scss" scoped>
  .page-banner {
    :deep() {
      .el-carousel {
        border-radius: var(--el-border-radius-base);
        &__item {
          line-height: 150px;
          text-align: center;
          background: linear-gradient(
            to right,
            var(--el-color-primary-light-7),
            var(--el-color-primary-light-2),
            var(--el-color-primary)
          );

          h5 {
            position: relative;
            padding: 0;
            margin: 0;
            font-family: monospace;
            font-size: 24px;
          }

          h5::after {
            position: absolute;
            right: -30px;
            display: inline-block;
            width: 30px;
            height: 30px;
            content: '';
            border-radius: 2px;
          }

          h5.ended::after {
            animation: 1.1s cursor steps(2, jump-none) infinite;
          }

          @keyframes cursor {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          h5 span {
            --delay: 10s;
            display: inline-block;
            width: 0ch;
            overflow: hidden;
            color: var(--el-color-white);
            animation: 0.1s text-in ease-in-out forwards;
            animation-delay: var(--delay);
          }

          @keyframes text-in {
            from {
              width: 0ch;
            }
            to {
              width: 2ch;
            }
          }
        }
      }
    }
  }
</style>
