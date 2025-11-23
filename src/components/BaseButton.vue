<!--
 * @Author: longmo
 * @Date: 2025-11-17 23:33:56
 * @LastEditTime: 2025-11-23 18:48:39
 * @FilePath: src/components/BaseButton.vue
 * @Description:
 -->
<!--<script setup lang="ts">-->
<!--import { defineComponent, useAttrs, useListeners } from 'vue';-->

<!--const $attrs = useAttrs();-->
<!--const $listeners = useListeners();-->
<!--</script>-->

<template>
  <button v-bind="$attrs" v-on="$listeners">
    <slot>BaseButton666</slot>
  </button>
</template>
