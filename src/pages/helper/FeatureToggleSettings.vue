<template>
  <div class="q-pa-md q-gutter-sm">
    <!--    <q-banner v-if="!useAuthStore().userMayAccess(AccessItem.FEATURE_TOGGLES)" rounded style="border:1px solid orange">-->
    <!--      To use feature toggles, you need to have a (free) account.-->
    <!--    </q-banner>-->
    <!--    <template v-else>-->
    <q-banner rounded style="border: 1px solid orange"
      >Switch on experimental features (or off). These feature toggles are meant for developers only as they might break
      functionality and/or destroy data. Once they are considered 'safe enough', they will be available at the
      "experimental features" view on the left.
    </q-banner>

    <div class="row q-pa-md">
      <div class="col-3"><b>Developer Mode</b></div>
      <div class="col-3">
        activates a couple of experimental features and debug insights. You should only use this if you can live with
        loosing data.
      </div>
      <div class="col-1"></div>
      <div class="col-5">
        <q-toggle v-model="devEnabled" @click="updateSettings(FeatureIdent.DEV_MODE.toString(), devEnabled)" />
      </div>
    </div>

    <div class="row q-pa-md" v-if="useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)">
      <div class="col-3"><b>Send Message to current User</b></div>
      <div class="col-3">a new message will be created for the current user and should appear in the side panel</div>
      <div class="col-1"></div>
      <div class="col-5">
        <q-btn label="Create Message" no-caps @click="triggerMessage('dummy message triggered by user')" />
      </div>
    </div>

    <div class="row q-pa-md" v-if="useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)">
      <div class="col-3"><b>Trigger CommandExecution Error Handler</b></div>
      <div class="col-3">
        this should initiate a sentry error message like the ones happening when running into a problem executing a
        command.
      </div>
      <div class="col-1"></div>
      <div class="col-5">
        <q-btn label="Trigger Error" no-caps @click="triggerErrorHandler()" />
      </div>
    </div>
    <div class="row q-pa-md" v-if="useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)">
      <div class="col-3"><b>Trigger Catch-All Error Handler</b></div>
      <div class="col-3">this should initiate a sentry error message from the vue error interceptor.</div>
      <div class="col-1"></div>
      <div class="col-5">
        <q-btn label="Trigger Error" no-caps @click="triggerCatchAll()" />
      </div>
    </div>
    <div class="row q-pa-md" v-if="useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)">
      <div class="col-3"><b>Collect User Feedback</b></div>
      <div class="col-3"></div>
      <div class="col-1"></div>
      <div class="col-5">
        <q-btn label="User Feedback" no-caps @click="collectUserFeedback()" />
      </div>
    </div>
    <div class="row q-pa-md" v-if="useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)">
      <div class="col-3"><b>Create a (dummy) suggestion</b></div>
      <div class="col-3">Suggestions are shown to the user to let her decide if they are applicable</div>
      <div class="col-1"></div>
      <div class="col-5">
        <q-btn label="Tabset Shared" no-caps @click="createSuggestion('TABSET_SHARED')" />
        <q-btn label="Use Extension" no-caps @click="createSuggestion('USE_EXTENSION')" v-if="!inBexMode()" />
        <q-btn label="Spaces Feature" no-caps @click="createSuggestion('FEATURE')" />
        <q-btn label="Clear all" no-caps @click="clearSuggestions()" />
      </div>
    </div>
    <!--    </template>-->
  </div>
</template>

<script lang="ts" setup>
import { captureFeedback, captureMessage } from '@sentry/browser'
import { doc, setDoc } from 'firebase/firestore'
import { uid } from 'quasar'
import { FeatureIdent } from 'src/app/models/FeatureIdent'
import { useCommandExecutor } from 'src/core/services/CommandExecutor'
import { useNotificationHandler } from 'src/core/services/ErrorHandler'
import { useUtils } from 'src/core/services/Utils'
import { useSettingsStore } from 'src/core/stores/settingsStore'
import { ActivateFeatureCommand } from 'src/features/commands/ActivateFeatureCommand'
import { DeactivateFeatureCommand } from 'src/features/commands/DeactivateFeatureCommand'
import { useFeaturesStore } from 'src/features/stores/featuresStore'
import FirebaseServices from 'src/services/firebase/FirebaseServices'
import { Suggestion, SuggestionType } from 'src/suggestions/domain/models/Suggestion'
import { useSuggestionsStore } from 'src/suggestions/stores/suggestionsStore'
import { Message } from 'src/tabsets/models/Message'
import { useAuthStore } from 'stores/authStore'
import { ref, watchEffect } from 'vue'

const { inBexMode } = useUtils()
const settingsStore = useSettingsStore()
const { handleError } = useNotificationHandler()

const devEnabled = ref<boolean>(useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE) || false)

watchEffect(() => {
  devEnabled.value = useFeaturesStore().hasFeature(FeatureIdent.DEV_MODE)
})

const updateSettings = (ident: string, val: boolean) => {
  console.log('settings updated to', ident, val)
  if (val) {
    useCommandExecutor().execute(new ActivateFeatureCommand(ident))
  } else {
    useCommandExecutor().execute(new DeactivateFeatureCommand(ident))
  }
  // TODO deprecated
  settingsStore.setFeatureToggle(ident, val)
}

const triggerMessage = (msg: string) => {
  const message = new Message(uid(), new Date().getTime(), 0, 'new', msg)
  setDoc(
    doc(FirebaseServices.getFirestore(), `users/${useAuthStore().user.uid}/messages/${message.id}`),
    JSON.parse(JSON.stringify(message)),
  )
}

const triggerErrorHandler = () => handleError('an user-initiated error message from tabsets at ' + new Date().getTime())

const triggerCatchAll = () => {
  throw new Error('user triggered catch-all-Error at' + new Date().getTime())
}

const clearSuggestions = () => {
  useSuggestionsStore().clearAll()
}

const createSuggestion = async (type: SuggestionType) => {
  switch (type) {
    case 'TABSET_SHARED':
      const s = new Suggestion(
        uid(),
        'New Shared Tabset',
        'Carsten wants to share a new tabset with you',
        uid(),
        'TABSET_SHARED',
      )
      s.setImage('o_tabs')
      s.applyLabel = 'accept'
      await useSuggestionsStore().addSuggestion(s)
      break
    // case 'USE_EXTENSION':
    //   await useSuggestionsStore().addSuggestion(Suggestion.getStaticSuggestion('USE_EXTENSION_SUGGESTION'))
    //   break
    case 'FEATURE':
      await useSuggestionsStore().addSuggestion(Suggestion.getStaticSuggestion('TRY_SPACES_FEATURE'))
      break
    default:
      console.warn(`unknown type ${type}`)
  }
}

const collectUserFeedback = async () => {
  const eventId = captureMessage('User Feedback')
  // OR: const eventId = Sentry.lastEventId();

  const userFeedback = {
    name: 'John Doe',
    email: 'john@doe.com',
    message: 'I really like your App, thanks!',
    associatedEventId: eventId,
  }
  captureFeedback(userFeedback)
}
</script>
