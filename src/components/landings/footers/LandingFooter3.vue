<template>
  <footer>
    <div class="content">
      <div class="text-and-form">
        <div>
          <div class="sitename">{{ site_name }}</div>
          <nav class="footer-menu">
            <ul>
              <li><a href="./index.php" aria-label="Home">Home</a></li>
              <li><a href="./privacy-policy.php" aria-label="Privacy policy">Privacy policy</a></li>
              <li><a href="./terms-and-conditions.php" aria-label="Terms and Conditions">Terms and Conditions</a></li>
              <li><a type="button" aria-label="Contact us">Contact us</a></li>
            </ul>
          </nav>
        </div>
        <div class="footer-disclaimer">
          <p class="text" style="font-size: 22px">
            Only for 21+
          </p>
          <p class="text" style="font-size: 18px">
            Disclaimer
          </p>
          <p class="text">
            This casino offers social casino games. It means you don't need to pay money, nor can you win any monetary prizes. Due to this activity's essence, only players older than 18 y.o. are allowed to participate in this casino. We want to warn you that succeeding in a social casino game doesn't give you the same chance in playing in a real-money casino.
          </p>
        </div>
      </div>
      <div class="all-rights">
        <p class="text">
          All rights reserved
        </p>
        <p class="text">
          <a href="./privacy-policy.php" aria-label="Privacy policy">Privacy policy</a>
        </p>
      </div>
    </div>
  </footer>
  <div class="modal-area" id="modal-18">
    <div class="modal-18">
      <p class="modal-18__header">Over 21 years old?</p>
      <div style="display: flex; flex-direction: row; gap: 8px; margin-top: 20px">
        <input type="checkbox" id="checkbox-18">
        <p>I agree with <a href="./privacy-policy.php">privacy policy</a></p>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: center; width: 100%; gap: 8px; margin-top: 20px">
        <button class="common-button" @click="confirm18()">
          Yes
        </button>
        <button class="common-button-2">
          No
        </button>
      </div>
    </div>
  </div>
  <div class="modal-cookie" id="modal-cookie">
    <div class="modal-cookie__modal">
      <p class="modal-cookie__header"> WE USE COOKIES </p>
      <p class="modal-cookie__text">
        We use our own and third-party cookies to personalize content and to analyze web traffic.
      </p>
      <a href="./privacy-policy.php">Read more about cookies.</a>
      <div style="display: flex; flex-direction: row;">
        <button class="common-button" @click="confirmCookies()" style="margin-right: 16px">
          Accept cookies
        </button>
        <button class="common-button-2">
          Reject
        </button>
      </div>
    </div>
  </div>
  <div class="log-in-modal" id="log-in-modal">
    <div class="modal-18">
      <form class="form-log-in hidden" id="form-log-in">
        <p class="modal-18__header">Log in</p>
        <label for="login-log-in">Username</label>
        <input class="common-input" type="text" id="login-log-in" name="login" placeholder="Username" required/>
        <label for="password-log-in">Password</label>
        <input class="common-input" type="password" id="password-log-in" name="password" placeholder="Password" required/>
        <button
          class="common-button"
          aria-label="Login"
          @click="logIn()"
        >
          Log In
        </button>
        <button
          aria-label="Don't have an account? Register now!"
          class="register-now"
          @click="showLogIn()"
        >
          Don't have an account? Register now!
        </button>
      </form>
      <form class="form-log-in" id="form-sign-up" action="./index.html" method="post">
        <p class="modal-18__header">Sign Up</p>
        <label for="user_name">Username</label>
        <input class="common-input" type="text" id="user_name" name="user_name" placeholder="Username" required/>
        <label for="phone_number">Phone</label>
        <input class="common-input" type="tel" id="phone_number" name="phone_number" placeholder="+15852826610" required/>
        <label for="email">Email</label>
        <input class="common-input" type="email" id="email" name="email" placeholder="playbestgames@email.com" required/>
        <label for="password">Password</label>
        <input class="common-input" type="password" id="password" name="password" placeholder="Password" required/>
        <button
          class="common-button"
          aria-label="Sign up"
          type="submit"
        >
          Sign Up
        </button>
        <button
          aria-label="Do you already have an account?"
          class="register-now"
          @click="showLogIn()"
        >
          Do you already have an account?
        </button>
      </form>
      <button
        aria-label="Do you already have an account?"
        class="play-demo"
        @click="playDemo()"
      >
        Play demo without registration
      </button>
    </div>
  </div>
  <div id="contact-us" class="contact-us">
    <div class="modal-18">
      <form class="form-log-in" action="">
        <div class="close-slot close-contact" @click="closeFormModal()"></div>
        <p class="modal-18__header">Contact us</p>
        <label for="email-or-user_nam">Username or email</label>
        <input class="common-input" type="text" id="email-or-user_name" name="email-or-user_nam" placeholder="Username" required/>
        <label for="message">Message</label>
        <textarea class="common-input" type="text" id="message" name="message" required></textarea>
        <button
          class="common-button"
          aria-label="Send message"
          type="submit"
        >
          Send message
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
  site_name: { type: String, required: true },
})
function confirm18() {
  let checkbox = document.getElementById('checkbox-18')
  if (checkbox.checked){
    document.getElementById('modal-18').style.display = 'none'
    localStorage.setItem('old', true)
  }
}
function confirmCookies() {
  document.getElementById('modal-cookie').style.display = 'none'
  localStorage.setItem('cookie', true)
}
function showLogIn() {
  document.getElementById('form-log-in').classList.toggle('hidden')
  document.getElementById('form-sign-up').classList.toggle('hidden')
}
function logIn () {
  localStorage.setItem('login', true)
}
function playDemo() {
  document.getElementById('log-in-modal').style.display = 'none'
}
function closeFormModal () {
  document.getElementById('contact-us').classList.remove('visible')
}

onMounted(() => {
  let menu = document.getElementById('h-menu')
  menu.addEventListener('click',function (e) {
    menu.classList.toggle('h-active')
    document.getElementById('menu').classList.toggle('menu-open')
  })

  if (!localStorage.getItem('old')) {
    document.getElementById('modal-18').style.display = 'flex'
  }
  if (!localStorage.getItem('cookie')) {
    document.getElementById('modal-cookie').style.display = 'flex'
  }
  if (!localStorage.getItem('login')) {
    // document.getElementById('log-in-modal').style.display = 'flex'
    document.getElementById('btn-log-in').style.display = 'flex'
    console.log('asd')
  }
  if(window.location.href.includes('log-in')){
    document.getElementById('log-in-modal').style.display = 'flex'
  }

  document.getElementById('contact-us').addEventListener('click', function(e){
    e.stopPropagation();
    if(e.target.classList.contains('visible')){
      document.getElementById('contact-us').classList.remove('visible')
    } else {
      return
    }
  })
})
</script>

<style lang="scss" scoped>
.sitename{
  font-size: 25px;
  font-weight: bold;
  text-transform: uppercase;
}
footer{
  display: flex;
  flex-direction: column;
  padding: 10px !important;
  width: 100%;
  text-align: center;
}
footer .text {
  font-size: 15px;
  font-weight: 600;
}
footer .title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
}
footer .all-rights{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.footer-disclaimer{
  gap: 8px;
  padding-bottom: 40px;
}
footer .common-button {
  height: 20px;
  padding: 0;
}
.all-rights p {
  font-size: 13px !important;
  width: fit-content;
}
footer form{
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
footer form input,
.common-input {
  background: transparent;
  padding: 0.5rem 1rem;
  margin-bottom: 10px;
  outline: none;
  min-height: 40px;
  max-height: 40px;
}
footer form button{
  min-height: 40px;
  padding-right: calc( 10px/2 );
  padding-left: calc( 10px/2 );
  margin-bottom: 20px;
  border: none;
  font-weight: bold;
}
.footer-menu ul{
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-right: 0px;
  margin-top: 24px;
  margin-bottom: 24px;
  font-weight: 700;
}
@media screen and (min-width: 1140px) {
  .footer-menu ul{
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 35px;
    margin-right: 24px;
    margin-top: 24px;
    font-weight: 700;
    margin-bottom: 40px;
  }
  .footer-disclaimer{
    padding-right: 20px;
    display: flex;
    flex-direction: column;
  }
  footer{
    padding: 20px;
    display: flex;
    align-items: center;
  }
  footer form{
    display: grid;
    grid-template-columns: auto 173px;
  }
  footer form input{
    margin-right: 10px;
  }
  footer .content {
    max-width: 1140px;
    margin-right: auto;
    margin-left: auto;
  }
  .text-and-form{
    display: flex;
    flex-direction: column;
  }

}
.visible {
  display: flex !important;
}
</style>
