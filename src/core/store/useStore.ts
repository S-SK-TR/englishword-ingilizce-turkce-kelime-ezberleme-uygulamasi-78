import { create } from 'zustand'
import { VocabularyItem } from '@/features/vocabulary/types'

interface StoreState {
  ui: {
    isLoading: boolean
    isDarkMode: boolean
  }
  vocabulary: {
    items: VocabularyItem[]
    currentQuiz: VocabularyItem[]
    quizScore: number
  }
}

interface StoreActions {
  setUi: (ui: Partial<StoreState['ui']>) => void
  setVocabulary: (vocabulary: Partial<StoreState['vocabulary']>) => void
  addVocabularyItem: (item: VocabularyItem) => void
  resetQuiz: () => void
}

type Store = StoreState & StoreActions

const useStore = create<Store>((set) => ({
  ui: {
    isLoading: false,
    isDarkMode: true
  },
  vocabulary: {
    items: [],
    currentQuiz: [],
    quizScore: 0
  },

  setUi: (ui) => set((state) => ({ ui: { ...state.ui, ...ui } })),
  setVocabulary: (vocabulary) => set((state) => ({ vocabulary: { ...state.vocabulary, ...vocabulary } })),
  addVocabularyItem: (item) => set((state) => ({
    vocabulary: {
      ...state.vocabulary,
      items: [...state.vocabulary.items, item]
    }
  })),
  resetQuiz: () => set((state) => ({
    vocabulary: {
      ...state.vocabulary,
      currentQuiz: [],
      quizScore: 0
    }
  }))
}))

export default useStore