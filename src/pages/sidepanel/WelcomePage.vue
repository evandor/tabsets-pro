<template>
  <q-page-container>
    <q-page>

      <div class="q-ma-none q-pa-md fit">
        <div class="row q-mt-lg">
          <div class="row">
            <div class="col-12 text-caption">
              The Art Of Linking
            </div>
          </div>
          <div class="col-12 text-h6 q-mb-md">
            {{ t('welcome_to_tabsets') }} {{ stageIdentifier() }}
          </div>
        </div>

        <div class="q-pa-sm q-mb-none row items-start q-gutter-md" @click.stop="selected()">
          <q-card class="my-card fit">
            <q-card-section>
              <span class="text-subtitle2">{{ t('create_your_first_ts') }}</span>
              <br>
              {{ t('provide_name_add_later')}}
            </q-card-section>
            <q-card-section class="q-pb-none">
              <q-input v-model="tabsetName"
                       class="input-box"
                       dense
                       autofocus
                       ref="tabsetNameRef"
                       :error-message="t('no_special_chars_and_length')"
                       :error="!newTabsetNameIsValid()"
                       data-testid="newTabsetName"
                       @keydown.enter="addFirstTabset()"
                       :label="t('tabset_name')"/>
            </q-card-section>
            <q-card-actions align="right" class="q-pr-md q-pb-md q-ma-none">
              <DialogButton
                :label="t('add_tabset')"
                @was-clicked="addFirstTabset"
                :disable="tabsetName.trim().length === 0 || !newTabsetNameIsValid()"/>
            </q-card-actions>
            <q-card-actions align="right" class="q-pr-md q-pb-md q-ma-none">
              <span class="q-mx-none cursor-pointer text-primary" style="font-size:smaller"
                    @click.stop="openBookmarksView">or open Bookmark Manager</span>
            </q-card-actions>
          </q-card>
        </div>
        <div class="row q-mr-sm">
          <div class="col-12 text-right">
            <span class="text-grey q-mx-none cursor-pointer" style="font-size:smaller"
                  @click.stop="clicked('https://tabsets.web.app/#/privacy')">Privacy</span>
            <span class="q-ma-none q-pa-none q-mx-xs text-grey-5">|</span>
            <span class="text-grey q-mx-none cursor-pointer" style="font-size:smaller"
                  @click.stop="clicked('https://tabsets.web.app/#/tos')">Terms of Service</span>
            <span class="q-ma-none q-pa-none q-mx-xs text-grey-5">|</span>
            <span class="text-grey q-mx-none cursor-pointer" style="font-size:smaller"
                  @click.stop="clicked('https://docs.tabsets.net')">{{ t('documentation') }}</span>
          </div>
        </div>

        <br><br>


      </div>
    </q-page>
  </q-page-container>
</template>

<script lang="ts" setup>

import {useUiStore} from "src/ui/stores/uiStore";
import {onMounted, ref, UnwrapRef, watchEffect} from "vue";
import {useRouter} from "vue-router";
import {useCommandExecutor} from "src/core/services/CommandExecutor";
import {CreateTabsetCommand} from "src/tabsets/commands/CreateTabset";
import {STRIP_CHARS_IN_USER_INPUT, TITLE_IDENT} from "boot/constants";
import Analytics from "src/core/utils/google-analytics";
import DialogButton from "src/core/dialog/buttons/DialogButton.vue";
import {useAuthStore} from "stores/authStore";
import {LocalStorage, openURL} from "quasar";
import {FeatureIdent} from "src/app/models/FeatureIdent";
import {AppFeatures} from "src/app/models/AppFeatures";
import {useI18n} from 'vue-i18n'
import {useTabsetsStore} from "src/tabsets/stores/tabsetsStore";
import {useFeaturesStore} from "src/features/stores/featuresStore";
import {SidePanelViews} from "src/models/SidePanelViews";

const {t} = useI18n()
const router = useRouter()

const tabsetName = ref('')
const tabsetNameRef = ref<HTMLElement>(null as unknown as HTMLInputElement)
const windowLocation = ref('---')
const activateFullPageApp = ref(false)
const login = ref(false)


onMounted(() => {
  Analytics.firePageViewEvent('WelcomePage', document.location.href);
  windowLocation.value = window.location.href
  LocalStorage.set(TITLE_IDENT, 'Tabsets' + stageIdentifier())
})

function setFeature(featureIdent: FeatureIdent, val: UnwrapRef<boolean>) {
  const feature = new AppFeatures().getFeature(featureIdent)
  console.log("feeature", feature)
  if (val && feature) {
    console.log("activating", featureIdent)
    useFeaturesStore().activateFeature(featureIdent.toLowerCase())
  } else if (!val && feature) {
    console.log("deactivateing", featureIdent)
    useFeaturesStore().deactivateFeature(featureIdent.toLowerCase())
  }
}

watchEffect(async () => {
  setFeature(FeatureIdent.STANDALONE_APP, activateFullPageApp.value)
})

watchEffect(() => {
  useUiStore().showLoginTable = login.value
})

watchEffect(() => {
  const ar = useAuthStore().useAuthRequest
  if (ar) {
    console.log(">>> authRequest received @", window.location.href)
    const baseLocation = window.location.href.split("?")[0]
    if (window.location.href.indexOf("?") < 0) {
      const tsIframe = window.parent.frames[0]
      //console.log("iframe", tsIframe)
      if (tsIframe) {
        console.debug(">>> new window.location.href", baseLocation + "?" + ar)
        tsIframe.location.href = baseLocation + "?" + ar
        tsIframe.location.reload()
      }
    }
    useAuthStore().setAuthRequest(null as unknown as string)
  }
})

watchEffect(() => {
  // we might have been redirected here too early, redirecting
  // back as soon we know we actually do have some tabsets
  if (useTabsetsStore().tabsets.size > 0) {
    console.log("routing back! We have tabsets!")
    router.back()
  }
})

const addFirstTabset = () => {
  useCommandExecutor()
    .executeFromUi(new CreateTabsetCommand(tabsetName.value, []))
    .then((res:any) => {
      useUiStore().sidePanelSetActiveView(SidePanelViews.MAIN)
      router.push("/sidepanel?first=true")
    })
}

const newTabsetNameIsValid = () =>
  tabsetName.value.length <= 32 && !STRIP_CHARS_IN_USER_INPUT.test(tabsetName.value)

//https://groups.google.com/a/chromium.org/g/chromium-extensions/c/nb058-YrrWc
const selected = () => tabsetNameRef.value.focus()

const stageIdentifier = () => process.env.TABSETS_STAGE !== 'PRD' ? ' (' + process.env.TABSETS_STAGE + ')' : ''

const clicked = (url: string) => openURL(url)

const openBookmarksView = () => {
  useUiStore().sidePanelSetActiveView(SidePanelViews.BOOKMARKS)
  router.push("/sidepanel/" + SidePanelViews.BOOKMARKS)
}

</script>

<style scoped>
:deep(.input-box .q-field__control),
:deep(.input-box .q-field__marginal) {
  height: 52px;
  font-size: 18px;
}
</style>
