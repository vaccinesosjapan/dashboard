/** 
 * md以上: h4サイズ
 * md以下: h5サイズ
 * 指定された背景色（bg_color）の輝度に応じて、文字色を白or黒へと変更する。
 */
<template>
	<h1 class="d-none d-md-flex text-h4 justify-center mb-2">{{ title }}</h1>
  <h1 class="d-flex d-md-none text-h5 justify-center mb-2">{{ title }}</h1>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const props = defineProps<{
  title: string
  bg_color: string
}>()

const font_color = shallowRef<string>('white')
const luminance = getLuminance(props.bg_color)
const luminanceBorder = 0.4
font_color.value = luminance > luminanceBorder ? "#000000" : "#FFFFFF";
</script>

<script lang="ts">
/**
 * HEXカラーコードから相対輝度（luminance）を計算する関数
 * @param hex - "#RRGGBB" 形式のカラーコード
 * @returns 0.0（暗い）〜 1.0（明るい）の輝度値
 */
const getLuminance = (hex: string): number => {
  // HEXの形式チェック（#RRGGBB）
  const isValidHex = /^#([0-9a-fA-F]{6})$/.test(hex);
  if (!isValidHex) {
    throw new Error("Invalid HEX color format. Expected '#RRGGBB'.");
  }

  // RGBに分解
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // sRGB → 線形RGB変換（ガンマ補正）
  const linear = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLin = linear(r);
  const gLin = linear(g);
  const bLin = linear(b);

  // 相対輝度の計算（WCAG仕様）
  const luminance = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  return luminance;
}
</script>

<style scoped>
h1 {
  background-color: v-bind(bg_color);
  color: v-bind(font_color);
  padding: 10px 20px;
  border-radius: 15px;
}
</style>