<template>
  <header>
    <div class="top-plank">
      Social casino: every game is free!
    </div>
    <div class="header">
      <div class="sitename">{{ site_name }}</div>
      <nav class="menu-pc">
        <ul>
          <li><a href="./index.html" aria-label="Home">Home</a></li>
          <li><a href="./privacy-policy.html" aria-label="Privacy policy">Privacy policy</a></li>
          <li><a href="./terms-and-conditions.html" aria-label="Terms and Conditions">Terms and Conditions</a></li>
          <li><a type="button" aria-label="Contact us" @click="showContactForm()">Contact us</a></li>
        </ul>
      </nav>
      <div class="header__buttons">
        <a aria-label="Log in" type="button" class="common-button btn-log-in" id="btn-log-in" href="./index.php?log-in">
          Log In
        </a>
        <div class="menu-btn__wrapper" aria-label="Menu">
          <div class="menu-btn-1" id="h-menu">
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <nav id="menu" class="menu">
      <ul>
        <li><a href="./index.php" aria-label="Home">Home</a></li>
        <li><a href="./privacy-policy.php" aria-label="Privacy policy">Privacy policy</a></li>
        <li><a href="./terms-and-conditions.php" aria-label="Terms and Conditions">Terms and Conditions</a></li>
        <li><a type="button" aria-label="Contact us" @click="showContactForm()">Contact us</a></li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
const props = defineProps({
  site_name: { type: String, required: true },
})

function showContactForm () {
  document.getElementById('contact-us').classList.add('visible')
}
</script>

<style lang="scss" scoped>
h3{
  font-size: 29px;
  font-weight: 400;
}
.sitename{
  font-size: 25px;
  font-weight: bold;
  text-transform: uppercase;
}
.menu-pc{
  display: none;
}
.top-plank{
  width: 100%;
  font-weight: bold;
  text-align: center;
}
header{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: sticky !important;
  top: 0 !important;
  width: 100%;
  overflow: hidden;
  right:0;
  z-index: 9;
}
.header{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-right: auto;
  margin-left: auto;
}
.menu-btn__wrapper{
  outline: none;
  display: flex;
  position: relative;
  width: 43.5px;
  height: 43.5px;
}
.menu-btn__wrapper:hover{
}
.menu-btn-1 {
  height: 20px;
  width: 25px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: auto;
  background: transparent;
}
.menu-btn-1 span,
.menu-btn-1 span::before,
.menu-btn-1 span::after{
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;

  -webkit-transition: 0.1s ease-in-out;
  -moz-transition: 0.1s ease-in-out;
  -o-transition: 0.1s ease-in-out;
  transition: 0.1s ease-in-out;
}
.menu-btn-1:hover span,
.menu-btn-1:hover span::before,
.menu-btn-1:hover span::after {
}
.menu-btn-1 span::before {
  margin-top: 8px;
}

.menu-btn-1 span::after {
  margin-top: 16px;
}

.menu-btn-1.h-active span {
  background: transparent !important;
}
.h-active{
  /*border: 0.1px solid black;*/
}
.menu-btn-1.h-active span::before {
  margin-top: 8px;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

.menu-btn-1.h-active span::after {
  margin-top: 8px;
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.menu {
  display: none;
  flex-direction: column;
  transform-origin: top;
  overflow: auto;
  transform: scaleY(1);
  width: 100%;
}
.menu ul {
  display: flex;
  flex-direction: column;
  list-style-type: none;
}
.menu li {
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 400;
  padding: 10px 20px;
  line-height: 20px;
}
.menu li:hover{
}
.menu a {
  text-decoration: none;
  all: unset;
}
.menu-open{
  display: flex !important;
}
.btn-log-in{
  display: none;
  text-align: center;
  justify-content: center;
  align-items: center;
  max-height: 40px;
  padding: 5px;
}
@media screen and (max-width: 320px) {
  .sitename{
    font-size: 16px;
    font-weight: normal;
  }
}
@media screen and (min-width: 1140px) {
  .sitename{
    font-size: 44px;
  }
  .btn-log-in{
    right: 23px;
  }
  .header {
    max-width: 1140px !important;
  }
  .menu-btn__wrapper{
    display: none;
  }
  .menu-pc{
    display: flex;
    flex-direction: row;
  }
  .menu-pc ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
  }
  .menu-pc ul li {
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    padding: 13px 20px;
  }
  .menu-pc ul li a:hover{
  }
  .menu-pc ul li a:active{
  }
}
.header__buttons{
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
