import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, RefreshCw } from 'lucide-react'
import useStore from '@/core/store/useStore'
import { VocabularyItem } from '../../types'

const DEMO_QUIZ = [
  { id: '1', english: 'Hello', turkish: 'Merhaba', createdAt: new Date().toISOString() },
  { id: '2', english: 'Goodbye', turkish: 'Güle güle', createdAt: new Date().toISOString() },
  { id: '3', english: 'Thank you', turkish: 'Teşekkür ederim', createdAt: new Date().toISOString() }
]

export function VocabularyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const {
    items,
    currentQuiz,
    quizScore,
    setVocabulary,
    resetQuiz
  } = useStore((state) => state.vocabulary)

  const quizItems = currentQuiz.length > 0 ? currentQuiz : DEMO_QUIZ
  const currentItem = quizItems[currentQuestion]

  useEffect(() => {
    if (currentQuiz.length === 0) {
      setVocabulary({ currentQuiz: quizItems })
    }
  }, [currentQuiz, quizItems, setVocabulary])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAnswer.trim()) return

    const correct = userAnswer.toLowerCase() === currentItem.turkish.toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setVocabulary({ quizScore: quizScore + 1 })
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizItems.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      // Quiz tamamlandı
      alert(`Quiz tamamlandı! Skor: ${quizScore}/${quizItems.length}`)
      resetQuiz()
      setCurrentQuestion(0)
      setUserAnswer('')
      setShowResult(false)
    }
  }

  const handleReset = () => {
    resetQuiz()
    setCurrentQuestion(0)
    setUserAnswer('')
    setShowResult(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelime Testi</h1>
        <button
          onClick={handleReset}
          className="btn bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]/80 text-[var(--text-primary)] flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Sıfırla</span>
        </button>
      </div>

      {currentQuiz.length === 0 && (
        <p className="text-sm text-[var(--text-secondary)]">Demo içerik gösteriliyor</p>
      )}

      <div className="glass-card p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-[var(--text-secondary)]">
            Soru {currentQuestion + 1}/{quizItems.length}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            Skor: {quizScore}/{quizItems.length}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8 text-primary-500">
          {currentItem.english}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="answer" className="block text-sm font-medium mb-2">
              Türkçe karşılığını yazın:
            </label>
            <input
              id="answer"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={showResult}
              className={`glass-input w-full px-4 py-3 text-lg ${showResult ? 'bg-[var(--bg-surface)]/30' : ''}`}
            />
          </div>

          {!showResult ? (
            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-lg"
            >
              Cevabı Gönder
            </button>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {isCorrect ? (
                  <Check className="text-green-500" size={24} />
                ) : (
                  <X className="text-red-500" size={24} />
                )}
                <div>
                  <p className="font-medium">
                    {isCorrect ? 'Doğru!' : 'Yanlış!'}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Doğru cevap: {currentItem.turkish}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-secondary w-full py-3 text-lg"
              >
                {currentQuestion < quizItems.length - 1 ? 'Sonraki Soru' : 'Testi Bitir'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}