import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import useStore from '@/core/store/useStore'
import { VocabularyFormData } from '../../types'

const formSchema = z.object({
  english: z.string().min(1, 'İngilizce kelime gereklidir'),
  turkish: z.string().min(1, 'Türkçe kelime gereklidir')
})

interface VocabularyFormProps {
  isOpen: boolean
  onClose: () => void
}

export function VocabularyForm({ isOpen, onClose }: VocabularyFormProps) {
  const addVocabularyItem = useStore((state) => state.addVocabularyItem)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VocabularyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      english: '',
      turkish: ''
    }
  })

  const onSubmit = (data: VocabularyFormData) => {
    addVocabularyItem({
      id: Date.now().toString(),
      english: data.english,
      turkish: data.turkish,
      createdAt: new Date().toISOString()
    })
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-6">Yeni Kelime Ekle</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="english" className="block text-sm font-medium mb-1">İngilizce Kelime</label>
            <input
              id="english"
              type="text"
              {...register('english')}
              className={`glass-input w-full px-4 py-2 text-sm ${errors.english ? 'border-red-500' : ''}`}
            />
            {errors.english && (
              <p className="text-red-500 text-xs mt-1">{errors.english.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="turkish" className="block text-sm font-medium mb-1">Türkçe Kelime</label>
            <input
              id="turkish"
              type="text"
              {...register('turkish')}
              className={`glass-input w-full px-4 py-2 text-sm ${errors.turkish ? 'border-red-500' : ''}`}
            />
            {errors.turkish && (
              <p className="text-red-500 text-xs mt-1">{errors.turkish.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]/80 text-[var(--text-primary)]"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}