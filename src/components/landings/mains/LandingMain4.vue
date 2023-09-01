<template>
  <main>
    <div class="main-wrapper">
      <h2>Social Casino Games<br> Play now for FREE! </h2>
      <swiper
        :slides-per-view="5"
        :autoplay="{ delay: 2000 }"
        :navigation="true"
        :modules="modules"
        id="slot-cards"
      >
        <swiper-slide
          class="slot-cards__card"
          v-for="(slot, index) in slots"
          :key="index"
          >
          <img :src="slot.image" :alt="slot.title"/>
          <button
            class="pl-now"
          >
            Play now
          </button>
          <v-dialog
            width="auto"
            activator="parent"
            v-model="dialogs[index]"
          >
            <div class="landing">
              <div class="slot-modal" :class="`buttons-rounded-${ buttons_rounded } color-scheme-${ color_scheme } card-rounded-${ card_rounded }`">
                <div class="modal-18 slot-modal-content" :class="`buttons-rounded-${ buttons_rounded } color-scheme-${ color_scheme } card-rounded-${ card_rounded }`">

                  <span>{{ slot.title }}</span>

                  <iframe class="_3Xz9Z" title="Embedded Content" name="htmlComp-iframe" allow="fullscreen" :src="slot.link"></iframe>
                  <span @click="dialogs[index] = false">Close</span>
                </div>
              </div>
            </div>
          </v-dialog>

        </swiper-slide>

      </swiper>
      <p class="game-text" style="margin-top: 40px">
        {{ text }}
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
  slots: { type: Array, required: true },
  text: { type: String, required: true },
  grid: { type: Number, required: true },
  card_rounded: { type: Number, required: true },
  color_scheme: { type: Number, required: true },
  buttons_rounded: { type: Number, required: true },
})

const modules = ref([Navigation])

let dialogs = ref([])

onMounted(()=>{
  if( props.slots ){
    for(let i = 0; i < props.slots.length; i++){
      dialogs.value.push(false)
    }
  }
  let ex_style = document.getElementById('slots-generated-grid')
  if(ex_style){
    ex_style.remove()
  }
  let grid_str = ''
  for (let i =0 ; i < props.grid; i ++){
    grid_str = grid_str + ' 1fr'
  }
  let s = document.createElement('style')
  s.id = 'slots-generated-grid'
  let c = `@media screen and (min-width: 1140px) {.slot-cards{ grid-template-columns: ${ grid_str } }}`
  s.innerHTML = c
  document.head.append(s)
})
</script>
<style lang="scss" scoped>
:deep(.swiper-button-next) {
  right: 0;
  margin: 0;
  position: absolute;
}
:deep(.swiper-button-prev) {
  left: 0;
  margin: 0;
  position: absolute;
}
.landing{
  width: unset !important;
}
.main-wrapper{
  max-width: 1140px;
  margin-right: auto;
  margin-left: auto;
}
h2{
  font-size: 23px !important;
  font-weight: 600;
  text-transform: uppercase;
  padding: 10px !important;
  margin-top: 35px !important;
  margin-bottom: 15px !important;
  text-align: center;
}
.page-card{
  margin: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
h3{
  font-size: 29px;
  font-weight: 400;
}
.page-text{
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  margin: 35px 10px;
}
.slot-cards{
  padding: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.slot-cards__card{
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  font-size: 100%;
  position: relative;

}
.slot-cards__card{
  margin: 5px;
}
.slot-cards__card{
  margin: 5px;
}
.slot-cards__text {

}
h4 {
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
}
.slot-cards__text button {
  background: transparent;
  width: 100%;
  text-align: center;
  border: none;
  outline: none;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
}
.game-text {
  text-align: center;
  padding: 10px;
  margin-bottom: 35px;
}
.play-btn {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 16px;
  border-radius: 8px;
  height: fit-content;
  width: fit-content;
  padding: 5px;
  text-align: center;
}
.popular {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 15px;
  background: #ff1f1f;
  color: white;
  font-weight: bold;
  padding: 3px 10px;
}
.slot-modal {

}
.slot-modal-content{
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  position: relative;
}
.slot-modal-content span {
  font-weight: 700;
  font-size: 24px;
}
.slot-modal-content iframe {
  width: 50vw;
  height: 50vh;
}
.slot-cards__card img{
  height: 190px;
  object-fit: cover;
}
.slot-cards__card{
  position: relative !important;
}
.slot-cards__card:hover img{
  filter: blur(2px);
}
.pl-now{
  height: fit-content;
  width: fit-content;
  display: block;
  position: absolute;
  content: "play now";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  -webkit-text-stroke: 1px #FFFFFF; /* Толщина и цвет обводки */
  text-stroke: 1px #FFFFFF;
  font-weight: bold;
  font-size: 22px;
}
@media screen and (min-width: 740px) and (max-width: 1139.9px) {
  .slot-cards__card{
    width: unset;
  }
  .slot-cards{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    height: fit-content;
  }
  .slot-cards__text {
  }
}
@media screen and (min-width: 1140px) {
  .slot-cards__card{
    position: relative !important;
  }
  .slot-cards__card:hover img{
    filter: blur(2px);
  }
  .pl-now{
    display: none;
  }
  .slot-cards__card:hover .pl-now{
    height: fit-content;
    width: fit-content;
    display: block;
    position: absolute;
    content: "play now";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    -webkit-text-stroke: 1px #FFFFFF; /* Толщина и цвет обводки */
    text-stroke: 1px #FFFFFF;
    font-weight: bold;
    font-size: 22px;
  }
  .slot-cards__card img{
    height: 340px;
  }
  .slot-cards__card{
    width: unset;
  }
  .slot-cards__card img{
    object-fit: cover;
  }
  .page-card__wrapper{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 20px;
  }
  h2{
    font-size: 34px !important;
  }
  .slot-cards{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-auto-rows: auto;
    height: fit-content;
  }
  .slot-cards__text {
  }
}



</style>
