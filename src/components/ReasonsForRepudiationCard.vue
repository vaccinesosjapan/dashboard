<template>
	<v-card title="否認理由について">
		<v-card-text>
		2023年2月10日 以前の報告では、否認理由は下図のように5段階で分けられていました。
		</v-card-text>
		<v-img src="images/TypeA.png"></v-img>

		<v-card-text>
		しかし、2023年3月14日 以降の報告では、否認理由は下図の4段階で表現されるようになりました。
		</v-card-text>
		<v-img src="images/TypeB.png"></v-img>

		<v-card-text>
		それぞれの数字が表す内容が異なるため、本サイトではタイプを表す文字列をつけて区別するようにしました。
		<ul>
			<li>2023年2月10日 以前: TypeA-</li>
			<li>2023年3月14日 以降: TypeB-</li>
		</ul>
		</v-card-text>

		<v-card-actions>
		<v-spacer></v-spacer>

		<v-btn
			text="閉じる"
			@click="closeFunc"
		>閉じる</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
defineProps<{
  closeFunc: ()=>void
}>()
</script>

<style scoped></style>