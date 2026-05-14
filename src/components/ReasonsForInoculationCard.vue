<template>
	<v-card title="接種種類について">
		<v-card-text>
			<p>
				コロナワクチンは、接種の時期や年齢等で救済制度の申請区分が分かれます。<br>
				出力したいデータ区分に✅を入れてください。
			</p>

			<ol>
				<li>特例臨時接種</li>
				<li>定期接種(B類)</li>
			</ol>

			<p class="small-text">※ 「任意接種」は、予防接種健康被害救済制度の対象外のため選択不可。</p>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn variant="outlined" text="閉じる" @click="closeFunc">閉じる</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
defineProps<{
	closeFunc: () => void
}>()
</script>

<style scoped>
ol {
	counter-reset: list;
	list-style-type: none;
	font: 14px/1.6 'arial narrow', sans-serif;
	padding: 0;
}

ol li {
	position: relative;
	margin: 7px 0 7px 0px;
	padding-left: 40px;
	font-weight: bold;
	font-size: 16px;
	line-height: 30px;
	border: 2px solid #756C67;
	color: #756C67;
}

ol li:before {
	counter-increment: list;
	content: counter(list);
	position: absolute;
	left: 0px;
	width: 30px;
	height: 30px;
	text-align: center;
	color: #fff;
	line-height: 30px;
	background: #756C67;
	top: 50%;
	-moz-transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	-o-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
}

.small-text {
	font-size: 0.8rem;
}
</style>