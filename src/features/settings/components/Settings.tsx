import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Sun, Save } from 'lucide-react'
import useStore from '@/core/store/useStore'

interface SettingsFormData {
  notifications: boolean
  darkMode: boolean
}

export function Settings() {
  const { isDarkMode, setUi } = useStore((state) => state.ui)
  const [formData, setFormData] = useState<SettingsFormData>({ notifications: true, darkMode: isDarkMode })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUi({ isDarkMode: formData.darkMode })
    alert('Ayarlar kaydedildi!')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ayarlar</h1>

      <div className="glass-card p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Bildirimler</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full ${formData.notifications ? 'bg-primary-500' : 'bg-gray-600'} transition-colors`} />
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.notifications ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-sm">Günlük hatırlatma bildirimleri</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tema</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full ${formData.darkMode ? 'bg-primary-500' : 'bg-gray-600'} transition-colors`} />
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.darkMode ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-sm flex items-center gap-1">
                  {formData.darkMode ? <Moon size={16} /> : <Sun size={16} />}
                  {formData.darkMode ? 'Koyu Mod' : 'Açık Mod'}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)]/50">
            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
            >
              <Save size={18} />
              <span>Ayarları Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}