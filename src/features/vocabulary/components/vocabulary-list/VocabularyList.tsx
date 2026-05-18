import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import useStore from '@/core/store/useStore'
import { VocabularyCard } from '../vocabulary-card/VocabularyCard'
import { VocabularyForm } from '../vocabulary-form/VocabularyForm'

const DEMO_ITEMS = [
  { id: '1', english: 'Hello', turkish: 'Merhaba', createdAt: new Date().toISOString() },
  { id: '2', english: 'Goodbye', turkish: 'Güle güle', createdAt: new Date().toISOString() },
  { id: '3', english: 'Thank you', turkish: 'Teşekkür ederim', createdAt: new Date().toISOString() }
]

export function VocabularyList() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { items } = useStore((state) => state.vocabulary)
  const displayItems = items.length > 0 ? items : DEMO_ITEMS

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelime Listesi</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Yeni Kelime</span>
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-[var(--text-secondary)]">Demo içerik gösteriliyor</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VocabularyCard item={item} />
          </motion.div>
        ))}
      </div>

      <VocabularyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  )
}