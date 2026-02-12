<template>
  <v-sheet variant="elevated" color="blue-grey-darken-1" class="pl-2 pt-2">
    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">接種からの経過（No. {{ no }}）</v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item dot-color="yellow-darken-1" size="x-small">
                <div class="mb-4">
                  <strong>{{ vaccinated_dates }}</strong>： ワクチンを接種
                </div>
              </v-timeline-item>

              <v-timeline-item dot-color="red" size="x-small">
                <div class="mb-4">
                  <strong>{{ onset_dates[0] }}</strong>： <span
                    v-if="ElapsedDays(vaccinated_dates, onset_dates[0]) != undefined">[接種から <v-chip variant="elevated"
                      label size="small" color="blue-grey-lighten-5">{{ ElapsedDays(vaccinated_dates, onset_dates[0])
                      }}</v-chip> 日後]</span>
                  <div class="pt-list">
                    <ul v-for="pt, j in PT_names" :key="j">
                      <li>{{ pt }}</li>
                    </ul>
                  </div>
                </div>
              </v-timeline-item>

            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">基礎疾患等</v-card-title>
          <v-card-text class="card-text"><span v-if="pre_existing_conditions_list.length < 2">{{ pre_existing_conditions }}</span>
            <div v-else>
              <ul class="pl-4" v-for="pec_item, j in pre_existing_conditions_list" :key="j">
                <li>{{ pec_item }}</li>
              </ul>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">報告医が死因等の判断に至った検査</v-card-title>
          <v-card-text class="card-text">{{ tests_used_for_determination == "" ? "なし" : tests_used_for_determination }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">専門家による評価コメント</v-card-title>
          <v-card-text class="card-text">{{ comments_by_expert == "" ? "なし" : comments_by_expert }}</v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-btn class="ml-2 mb-2" variant="outlined" @click="clickClose">詳細表示を閉じる</v-btn>
  </v-sheet>

</template>

<script setup lang="ts">
import { ElapsedDays } from '@/tools/ElapsedDays';

const props = defineProps<{
  no: number
  vaccinated_dates: string
  onset_dates: string[]
  PT_names: string[]
  pre_existing_conditions: string
  tests_used_for_determination: string
  comments_by_expert: string
  clickClose: () => void
}>()

const pre_existing_conditions_list = props.pre_existing_conditions.split('\n')
</script>

<style scoped>
.pt-list {
  padding-left: 20px;
  padding-top: 5px;
}

.card-text {
  width: 100%;
}

.card-title {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
</style>
