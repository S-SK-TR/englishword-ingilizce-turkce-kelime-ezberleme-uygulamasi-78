export interface VocabularyItem {
  id: string
  english: string
  turkish: string
  createdAt: string
  lastReviewed?: string
  reviewCount?: number
}

export interface VocabularyFormData {
  english: string
  turkish: string
}