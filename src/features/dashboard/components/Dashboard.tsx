import { motion } from 'framer-motion'
import { BookOpen, HelpCircle, Clock, Star } from 'lucide-react'
import useStore from '@/core/store/useStore'

const DEMO_STATS = {
  totalWords: 15,
  quizScore: 8,
  lastReviewed: new Date().toISOString(),
  favoriteWord: 'Hello'
}

export function Dashboard() {
  const { items, quizScore } = useStore((state) => state.vocabulary)
  const stats = {
    totalWords: items.length > 0 ? items.length : DEMO_STATS.totalWords,
    quizScore: quizScore > 0 ? quizScore : DEMO_STATS.quizScore,
    lastReviewed: items.length > 0 ? items[items.length - 1].createdAt : DEMO_STATS.lastReviewed,
    favoriteWord: items.length > 0 ? items[0].english : DEMO_STATS.favoriteWord
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {items.length === 0 && (
        <p className="text-sm text-[var(--text-secondary)]">Demo içerik gösteriliyor</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Kelime"
          value={stats.totalWords}
          icon={BookOpen}
          color="text-primary-500"
        />
        <StatCard
          title="Test Skoru"
          value={`${stats.quizScore}/${stats.totalWords}`}
          icon={HelpCircle}
          color="text-secondary-500"
        />
        <StatCard
          title="Son İnceleme"
          value={new Date(stats.lastReviewed).toLocaleDateString()}
          icon={Clock}
          color="text-accent-500"
        />
        <StatCard
          title="Favori Kelime"
          value={stats.favoriteWord}
          icon={Star}
          color="text-yellow-500"
        />
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Hızlı Başlangıç</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            title="Yeni Kelime Ekle"
            description="Kelime haznenize yeni kelime ekleyin"
            icon={BookOpen}
            to="/vocabulary"
          />
          <QuickActionCard
            title="Test Yap"
            description="Kelimelerinizi test edin"
            icon={HelpCircle}
            to="/quiz"
          />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-5 h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
        <Icon size={18} className={color} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ElementType
  to: string
}

function QuickActionCard({ title, description, icon: Icon, to }: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-5 h-full flex items-center gap-4 cursor-pointer"
      onClick={() => window.location.href = to}
    >
      <div className="p-3 rounded-lg bg-primary-500/10 text-primary-500">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
    </motion.div>
  )
}