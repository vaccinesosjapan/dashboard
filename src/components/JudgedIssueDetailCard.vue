<template>

  <v-sheet variant="elevated" color="blue-grey-darken-1" class="pl-2 pt-2">
    <v-row>
      <v-col cols="12" md="4">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">症状一覧</v-card-title>
          <v-card-text class="test">
            <div class="mb-4">
              <div class="bd-list">
                <ul v-for="bd, j in symptoms.filter(n => n != '').filter(m => m != ' ')" :key="j">
                  <li>{{ bd }}</li>
                </ul>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">基礎疾患一覧</v-card-title>
          <v-card-text class="test">
            <div class="mb-4">
              <div class="bd-list">
                <ul v-for="bd, j in pre_existing_disease_names" :key="j">
                  <li>{{ bd }}</li>
                </ul>
              </div>
            </div>
          </v-card-text>

        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">備考</v-card-title>
          <v-card-text class="test">
            <p class="mb-4">
              {{ remark_content }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-btn class="ml-2 mb-2" variant="outlined" @click="clickClose">詳細表示を閉じる</v-btn>
  </v-sheet>

</template>

<script setup lang="ts">
defineProps<{
  symptoms: string[]
  pre_existing_disease_names: string[]
  remark_content: string
  clickClose: () => void
}>()
</script>

<style scoped>
.bd-list {
  padding-left: 20px;
  padding-top: 5px;
}

.test {
  width: 100%;
}

.card-title {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
</style>
