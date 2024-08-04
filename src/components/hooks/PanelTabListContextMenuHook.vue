<template>
<!--  <q-item v-if="useFeaturesStore().hasFeature(FeatureIdent.RESEARCH_SESSIONS) && hasResearchData()"-->
<!--          clickable v-close-popup @click.stop="openResearchPage()">-->
<!--    <q-item-section style="padding-right:0;min-width:25px;max-width: 25px;">-->
<!--      <q-icon size="xs" name="o_science" color="info"/>-->
<!--    </q-item-section>-->
<!--    <q-item-section>-->
<!--      Research-->
<!--    </q-item-section>-->
<!--  </q-item>-->


  <!--  <q-separator inset/>-->
</template>

<script lang="ts" setup>

import {PropType} from "vue";
import {Tab} from "src/tabsets/models/Tab";
import {Tabset} from "src/tabsets/models/Tabset";
import {useRouter} from "vue-router";

const props = defineProps({
  tab: {type: Object as PropType<Tab>, required: true},
  tabset: {type: Object as PropType<Tabset>, required: false}
})

const router = useRouter()



</script>
