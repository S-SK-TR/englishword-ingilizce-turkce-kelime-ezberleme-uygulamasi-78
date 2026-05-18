import { motion } from 'framer-motion'
import { VocabularyItem } from '../../types'

interface VocabularyCardProps {
  item: VocabularyItem
}

export function VocabularyCard({ item }: VocabularyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-5 h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-primary-500">{item.english}</h3>
        <span className="text-xs text-[var(--text-secondary)]">#{item.id}</span>
      </div>
      <p className="text-[var(--text-primary)]">{item.turkish}</p>
      <div className="mt-4 pt-3 border-t border-[var(--border-color)]/50 flex justify-between text-xs text-[var(--text-secondary)]">
        <span>Oluşturuldu: {new Date(item.createdAt).toLocaleDateString()}</span>
        {item.lastReviewed && (
          <span>Son İnceleme: {new Date(item.lastReviewed).toLocaleDateString()}</span>
        )}
      </div>
    </motion.div>
  )
}