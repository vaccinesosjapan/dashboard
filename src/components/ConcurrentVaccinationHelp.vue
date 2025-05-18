<template>
	<v-dialog transition="dialog-bottom-transition" width="auto">
		<template v-slot:activator="{ props }">
			<v-btn prepend-icon="mdi-information-outline" v-bind="props">
				<template v-slot:prepend>
					<v-icon color="info" size="x-large"></v-icon>
				</template>
				同時接種ワクチンについて...
			</v-btn>
		</template>

		<template v-slot:default="{ isActive }">
		<v-card title="同時接種ワクチンについて">
			<v-card-text>
				<p>新型コロナワクチンと同時にインフルエンザワクチンなどを接種する場合があり、症例一覧の「同時接種」列で有無を表示しています。</p>
				<p>同時に接種したワクチンの「ワクチン名」「製造販売業者」「ロット番号」などの詳しい情報については、行をクリックして表示される詳細表示画面（下図）で確認してください。</p>
				<br />
				<p>
					■ 詳細表示画面の例:
					<v-img src="images/concurrent-vaccination/sample-detail.png"></v-img>
				</p>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text="閉じる"
					@click="isActive.value = false"
				>閉じる</v-btn>
			</v-card-actions>
		</v-card>
		</template>
	</v-dialog>
</template>

<script setup lang="ts">
</script>

<style lang="css" scoped>
</style>
