<template>
  <div class="menu">
    <div class="item" v-for='item in items' @click="collapse(item.children)">
      {{ item.name }}
    </div>
  </div>
</template>

<style scoped></style>

<script>
import { defineProps } from 'vue'
import { Menu } from './Menu';

const { items } = defineProps({ items: Menu })

function collapse(children) {

}
</script>
