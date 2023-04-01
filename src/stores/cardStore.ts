import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ICard {
  title: string | null
  progress: number
}

export const useCardStore = defineStore('CardStore', () => {
  // State
  const cards = ref([] as ICard[])

  // Attempt to read from the browser's internal storage.
  function init() {
    const cardsInLocalStorage = localStorage.getItem('cardStore')
    if (cardsInLocalStorage == null) {
      cards.value = []
      return
    }

    cards.value = JSON.parse(cardsInLocalStorage) as ICard[]
  }

  // Save state to the browser's internal storage
  function save() {
    localStorage.setItem('cardStore', JSON.stringify(cards.value))
  }

  function addCard(card: ICard) {
    cards.value.push(card)
    save()
  }

  function removeCard(index: number) {
    cards.value.splice(index, 1)
    save()
  }

  function modifyCard(index: number, card: Partial<ICard>) {
    cards.value[index] = { ...cards.value[index], ...card }
    save()
  }

  function clearAllCards() {
    cards.value = []
    save()
  }

  return {
    cards,
    init,
    save,
    addCard,
    modifyCard,
    removeCard,
    clearAllCards
  }
})
