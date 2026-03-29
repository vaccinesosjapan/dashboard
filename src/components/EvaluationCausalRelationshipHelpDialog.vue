<template>
	<v-dialog transition="dialog-bottom-transition" width="auto">
		<template v-slot:activator="{ props }">
			<v-btn class="text-body-2 mb-5" prepend-icon="mdi-help-circle-outline" 
			v-bind="props" text="因果関係の評価について..." color="blue-grey-lighten-2"></v-btn>
		</template>

		<template v-slot:default="{ isActive }">
		<v-card title="医療機関からの副反応疑い報告における因果関係評価などについて">
			<v-card-text>
				「因果関係」などの情報に関して、「報告医評価」と「専門家評価」が混在するデータです。
			</v-card-text>

			<v-card-text>
				<h3>検討部会の第104回まで</h3>
				<p>「因果関係」や「重篤度」について、「報告医評価」の内容のみが公開されていました。</p>
				<br />
				<v-img src="images/mi-issues/104th-001325449.png" />
				<p class="text-caption text-right">※ 
					<a href="https://www.mhlw.go.jp/content/11120000/001325449.pdf#page=2">元資料</a>
				からの引用</p>
			</v-card-text>

			<v-card-text>
				<h3>検討部会の第105回以降</h3>
					<p>「報告医評価」の「因果関係」や「重篤度」だけでなく、<span class="font-weight-bold">専門家の「PT」「因果関係評価」「ブライトン分類レベル」といった情報も公開されるようになりました。</span>
					ただし、それらの専門家評価が記載されているのは、一部の症例に限られているようです。
				</p>
				<br />
				<v-img src="images/mi-issues/105th-001383702.png" />
				<p class="text-caption text-right">※
					<a href="https://www.mhlw.go.jp/content/11120000/001383702.pdf#page=7">元資料</a>
					からの引用
				</p>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text="閉じる"
					@click="isActive.value = false"
					variant="outlined"
					color="blue-darken-2"
				>閉じる</v-btn>
			</v-card-actions>
		</v-card>
		</template>
	</v-dialog>
</template>

<script setup lang="ts">
</script>

<style scoped>
.wrap-text {
	white-space: normal;
}
</style>
