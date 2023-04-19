<template>
    <div class="w-[100vw] h-[100vh]">
        <header>
            <div class="navbar bg-primary">
                <div class="navbar-start">
                    <div class="avatar">
                        <img src="/mountain-32.png" />
                    </div>
                    <div class="prose pl-2"><h2 class="text-white">Kosciuszko</h2></div>
                </div>
                <div class="navbar-center">
                    <div class="form-control">
                        <input
                            class="input input-ghost bg-primary-focus sm:text-xl md:text-2xl lg:text-4xl text-center w-fit text-white"
                            @input="debouncedOnSetTitle"
                            :value="cardStore.title"
                        />
                    </div>
                </div>
                <div class="navbar-end gap-2">
                    <button class="btn btn-secondary" @click="OnShowImportModal">Import</button>
                    <button class="btn btn-secondary" @click="OnClickExportButton">
                        {{ state.exportButtonState.showCoppiedText ? 'Coped!' : 'Export' }}
                    </button>
                    <button class="btn" @click="OnAddNewGroup">Add New Group</button>
                </div>
            </div>
        </header>
        <ProgressSection class="w-full h-full" />

        <!-- Import Modal -->
        <dialog ref="importDialog" class="min-w-fit w-9/12 rounded-lg" @click="ClickOnDialog">
            <section class="card">
                <div class="card-body p-0">
                    <div class="card-title flex flex-row">
                        <div class="flex-1">Import</div>
                        <button class="btn btn-error" @click="OnHideImportModal">
                            <font-awesome-icon icon="fa-solid fa-xmark" />
                        </button>
                    </div>
                    <div>
                        <div class="w-full form-control">
                            <label class="label">Import Hash</label>
                            <textarea
                                :value="state.importModalState.importText"
                                class="w-full textarea"
                                @input="(event : Event) => state.importModalState.importText = (event.target as HTMLTextAreaElement).value"
                            />
                        </div>
                        <button
                            class="btn btn-success my-2"
                            :disabled="!cardStore.validateHash(state.importModalState.importText)"
                            @click="
                                () => {
                                    cardStore.setStateFromHash(state.importModalState.importText)
                                    OnHideImportModal()
                                }
                            "
                        >
                            Import
                        </button>
                    </div>
                </div>
            </section>
        </dialog>
    </div>
</template>

<script setup lang="ts">
// Imports
import ProgressCard from './components/ProgressCard.vue'
import ProgressSection from './components/ProgressSection.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { computed, inject, onMounted, reactive, ref, watch, type ComputedRef } from 'vue'
import { useCardStore, type ICard } from './stores/cardStore'
import draggable from 'vuedraggable'
import type { Emitter, EventType } from 'mitt'
import _ from 'lodash'

// Store
const cardStore = useCardStore()
const emitter = inject<Emitter<Record<EventType, unknown>>>('emitter') // global event bus
const importDialog = ref<HTMLDialogElement | null>(null)

// State
const state = reactive({
    importModalState: {
        importText: '' as string,
        importEorr: '' as string
    },
    exportButtonState: {
        showCoppiedText: false as boolean
    }
})

// Events
function OnAddNewGroup() {
    cardStore.addNewGroup()
    emitter?.emit('progressBarResize')
}

function OnShowImportModal() {
    importDialog.value?.showModal()
}

function OnHideImportModal() {
    importDialog.value?.close()
}

const debouncedUnsetCopiedText = _.debounce(UnsetCopiedText, 500)
function UnsetCopiedText() {
    state.exportButtonState.showCoppiedText = false
}

function OnClickExportButton() {
    state.exportButtonState.showCoppiedText = true
    navigator.clipboard.writeText(cardStore.getStateHash())
    debouncedUnsetCopiedText()
}

function ClickOnDialog(event: MouseEvent) {
    // Get the bounding rect of the modal.
    let rect = importDialog.value?.getBoundingClientRect()
    if (rect == undefined) {
        return
    }

    const ClickedOutsideBoudningBox =
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY

    if (ClickedOutsideBoudningBox) {
        importDialog.value?.close()
    }
}

const debouncedOnSetTitle = _.debounce(OnSetTitle, 200)
function OnSetTitle(event: Event) {
    cardStore.title = (event.target as HTMLInputElement).value
    cardStore.save()
}
</script>
<style scoped></style>
