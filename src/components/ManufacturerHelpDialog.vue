<template>
	<v-dialog transition="dialog-bottom-transition" width="auto">
		<template v-slot:activator="{ props }">
			<v-btn prepend-icon="mdi-alert-outline" v-bind="props">
				<template v-slot:prepend>
					<v-icon color="warning" size="x-large"></v-icon>
				</template>
				製造販売業者について...
			</v-btn>
		</template>

		<template v-slot:default="{ isActive }">
		<v-card title="製造販売業者について">
			<v-card-text>
				<p>インフルエンザワクチンなどをコロナワクチンと同時に接種する場合があるため、症例一覧にはコロナワクチン以外のワクチン製造販売業者も列挙されています。</p>
				<p>
					<span>以下にコロナワクチン以外のワクチン製造販売業者の例を示します（2024/04/30 現在の情報）。</span>
					<ul class="my-list" v-for="m in exManufacturers" :key="m">
						<li>{{ m }}</li>
					</ul>
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
const exManufacturers = ['KMB', 'デンカ', '阪大微研会']
</script>

<style scoped>
.wrap-text {
	white-space: normal;
}

.my-list {
	padding: 0 2.5rem;
}
</style>
