import { defineStore } from 'pinia'
import { inject, reactive, ref, type ComputedRef, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

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

  // Attempt to read from the browser's internal storage.
  function init() {
    const cardsInLocalStorage = localStorage.getItem('cardStore')
    if (cardsInLocalStorage == null) {
      groups.value = []
      return
    }
    try {
      groups.value = JSON.parse(cardsInLocalStorage) as IGroup[]
    } catch (e) {
      groups.value = []
    }
  }

  // Save state to the browser's internal storage
  function save() {
    localStorage.setItem('cardStore', JSON.stringify(groups.value))
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
    groups.value[groupIndex].cards[index] = { ...groups.value[groupIndex].cards[index], ...card }
    save()
  }

  function clearAllCards(groupIndex: number) {
    groups.value[groupIndex].cards = []
    save()
  }

  return {
    groups,
    init,
    save,
    addNewGroup: addGroup,
    removeGroup,
    addCard,
    modifyCard,
    removeCard,
    clearAllCards
  }
})
