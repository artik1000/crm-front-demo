<template>
  <main>
    <div class="main-wrapper">
      <p class="game-text">
        {{ text }}
      </p>
      <h2>Top Rated Social Casino Games</h2>
      <div class="slot-cards" id="slot-cards">
        <div
          class="slot-cards__card"
          v-for="(slot, index) in slots"
          :key="index"
        >
          <img :src="slot.image" :alt="slot.title"/>
          <button
            class="play-btn"
            :title="`Play ${slot.title}`"
          >
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
            Play now
          </button>
          <div class="popular">Popular</div>
          <div class="slot-cards__text">
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";

const props = defineProps({
  slots: { type: Array, required: true },
  text: { type: String, required: true },
  grid: { type: Number, required: true },
  card_rounded: { type: Number, required: true },
  color_scheme: { type: Number, required: true },
  buttons_rounded: { type: Number, required: true },
})

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

    grid-auto-rows: auto;
    height: fit-content;
  }
  .slot-cards__text {
  }
}
.slot-cards__card img{
  height: 290px;
  object-fit: cover;
}
</style>
