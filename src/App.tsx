import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from './shared/components/layout/AppShell'
import { Dashboard } from './features/dashboard/components/Dashboard'
import { VocabularyList } from './features/vocabulary/components/vocabulary-list/VocabularyList'
import { VocabularyQuiz } from './features/vocabulary/components/vocabulary-quiz/VocabularyQuiz'
import { Settings } from './features/settings/components/Settings'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vocabulary" element={<VocabularyList />} />
            <Route path="/quiz" element={<VocabularyQuiz />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </AppShell>
    </BrowserRouter>
  )
}

export default App