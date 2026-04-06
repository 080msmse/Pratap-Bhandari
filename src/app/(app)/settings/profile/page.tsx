'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Save, Loader2, User } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Avatar } from '@/components/ui/avatar'
import toast from 'react-hot-toast'

export default function ProfileSettingsPage() {
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(session?.user?.name ?? '')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast.success('Profile updated!')
  }

  return (
    <div>
      <Header title="Profile" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            Personal Information
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4 mb-5">
              <Avatar src={session?.user?.image} name={session?.user?.name ?? undefined} size="xl" />
              <div>
                <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
                <button type="button" className="text-xs text-brand-600 hover:underline mt-1">
                  Change avatar
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input className="input-field bg-gray-50 text-gray-400" value={session?.user?.email ?? ''} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input className="input-field" type="password" placeholder="Leave blank to keep current password" />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
