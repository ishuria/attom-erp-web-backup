<template>
  <div class="portal-main">
    <header>
      <div class="index-nav">
        <div class="logo">
          <a href="/"></a>
        </div>
        <ul class="nav-item">
          <li>
            <a href="#/portal">页面1</a>
          </li>
          <li>
            <a href="#/portal">页面2</a>
          </li>
          <li><a href="#/portal">页面3</a></li>
          <li><a href="#/portal">页面4</a></li>
          <li><a href="#/portal">页面5</a></li>
        </ul>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
  .portal-main {
    margin-top: -12px;
    header {
      height: 71px;
      margin: 0;
      background: #fff;
      border-bottom: 1px solid #f3f5f6;
      .index-nav {
        min-width: 1152px;
        max-width: 1366px;
        margin: 0 auto;
      }
      .logo {
        float: left;
        margin: 0 20px;
        a {
          display: block;
          width: 140px;
          height: 71px;
          background: url('/@/assets/avatar.svg') center center no-repeat;
          transition: background-color 0.2s;
        }
      }
      .nav-item {
        li {
          float: left;
          list-style: none;

          a {
            position: relative;
            display: block;
            height: 71px;
            padding: 0 16px;
            font-size: 16px;
            line-height: 71px;
            color: #545c63;
            text-align: center;
            transition: background-color 0.3s;
          }
        }
      }
    }
  }
</style>
