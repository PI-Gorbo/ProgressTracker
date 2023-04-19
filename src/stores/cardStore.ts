import { defineStore } from 'pinia'
import { inject, reactive, ref, type ComputedRef, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import AES from 'crypto-js/aes'
import ENC from 'crypto-js/enc-utf8'

export interface ISerialize {
    groups: IGroup[]
    title: string | null
}

export interface IGroup {
    groupTitle: string
    cards: ICard[]
}

export interface ICard {
    id: string
    title: string | null
    progress: number
}

export const useCardStore = defineStore('CardStore', () => {
    // State
    const groups: Ref<IGroup[]> = ref([] as IGroup[])
    const title: Ref<string | null> = ref(null)

    // Serialize and Deserialize State
    function Serialize(): string {
        return JSON.stringify({
            groups: groups.value,
            title: title.value
        } as ISerialize)
    }

    function Deserialize(jsonString: string) {
        try {
            const obj = JSON.parse(jsonString)
            if ('groups' in obj && 'title' in obj) {
                groups.value = obj.groups
                title.value = obj.title
            } else {
                groups.value = []
                title.value = null
            }
        } catch (e) {
            reset()
        }
    }

    // Attempt to read from the browser's internal storage.
    function init(): void {
        const cardsInLocalStorage = localStorage.getItem('cardStore')
        if (cardsInLocalStorage == null) {
            reset()
            return
        }
        Deserialize(cardsInLocalStorage)
    }

    // Save state to the browser's internal storage
    function save() {
        localStorage.setItem('cardStore', Serialize())
    }

    function reset() {
        localStorage.removeItem('cardStore')
        groups.value = []
        title.value = null
    }

    function addGroup() {
        // Generate a new group
        let groupName = 'New Group'
        let counter = 1
        while (groups.value.find((x) => x.groupTitle === groupName) != undefined) {
            groupName = 'New Group ' + counter
            counter++
        }

        groups.value.push({
            groupTitle: groupName,
            cards: []
        })
        save()
    }

    function removeGroup(groupIndex: number) {
        groups.value.splice(groupIndex, 1)
        save()
    }

    function addCard(groupIndex: number, card: Omit<ICard, 'id'> = { title: '', progress: 0 }) {
        const cardWithId = { id: uuidv4(), ...card }
        groups.value[groupIndex].cards.push(cardWithId)
        save()
    }

    function removeCard(groupIndex: number, index: number) {
        groups.value[groupIndex].cards.splice(index, 1)
        save()
    }

    function modifyCard(groupIndex: number, index: number, card: Partial<Omit<ICard, 'id'>>) {
        groups.value[groupIndex].cards[index] = {
            ...groups.value[groupIndex].cards[index],
            ...card
        }
        save()
    }

    function clearAllCards(groupIndex: number) {
        groups.value[groupIndex].cards = []
        save()
    }

    function getStateHash(): string {
        const encryptedState = AES.encrypt(Serialize(), 'secretKey').toString()
        return encryptedState
    }

    function validateHash(hashValue: string): boolean {
        const bytes = AES.decrypt(hashValue, 'secretKey')
        const decryptedValue = bytes.toString(ENC)
        // Try parse with json
        try {
            JSON.parse(decryptedValue)
            return true
        } catch (error) {
            return false
        }
    }

    function setStateFromHash(value: string): void {
        const bytes = AES.decrypt(value, 'secretKey')
        const decryptedValue = bytes.toString(ENC)
        if (!validateHash(value)) {
            return
        }
        Deserialize(decryptedValue)
    }

    return {
        groups,
        title,
        init,
        reset,
        save,
        addNewGroup: addGroup,
        removeGroup,
        addCard,
        modifyCard,
        removeCard,
        clearAllCards,
        getStateHash,
        setStateFromHash,
        validateHash
    }
})
