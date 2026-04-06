'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Loader2, Mail, MoreHorizontal, Shield, UserCheck } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Modal } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { RoleBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Member {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    createdAt: string
  }
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('MEMBER')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [])

  async function loadMembers() {
    const res = await fetch('/api/team')
    const data = await res.json()
    setMembers(data)
    setLoading(false)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)

    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    })

    const data = await res.json()
    setInviting(false)

    if (!res.ok) {
      toast.error(data.error || 'Failed to invite')
      return
    }

    if (data.invited) {
      toast.success(`Invitation sent to ${inviteEmail}`)
    } else {
      toast.success(`${inviteEmail} added to your team!`)
      loadMembers()
    }

    setShowInviteModal(false)
    setInviteEmail('')
  }

  const roleOrder = { OWNER: 0, ADMIN: 1, MEMBER: 2, VIEWER: 3 }
  const sorted = [...members].sort((a, b) =>
    (roleOrder[a.role as keyof typeof roleOrder] ?? 99) - (roleOrder[b.role as keyof typeof roleOrder] ?? 99)
  )

  return (
    <div>
      <Header
        title="Team"
        actions={
          <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        }
      />

      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500 text-sm">{members.length} member{members.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Invite your colleagues to collaborate on projects."
            action={
              <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
                <Plus className="w-4 h-4" />
                Invite Member
              </button>
            }
          />
        ) : (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-5">Member</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-4">Joined</div>
            </div>
            <div className="divide-y divide-gray-50">
              {sorted.map((member) => (
                <div key={member.id} className="px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar src={member.user.image} name={member.user.name ?? undefined} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.user.name ?? 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <RoleBadge role={member.role} />
                  </div>
                  <div className="col-span-4 text-sm text-gray-500">
                    {formatRelativeTime(member.joinedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Permissions info */}
        <div className="mt-8 card p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-500" />
            Role Permissions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {[
              { role: 'Owner', color: 'bg-purple-50 text-purple-700', perms: ['Billing & Settings', 'Delete workspace', 'All admin access'] },
              { role: 'Admin', color: 'bg-blue-50 text-blue-700', perms: ['Manage members', 'Create projects', 'All member access'] },
              { role: 'Member', color: 'bg-gray-100 text-gray-700', perms: ['Create & edit tasks', 'Comment on tasks', 'View all projects'] },
              { role: 'Viewer', color: 'bg-gray-50 text-gray-500', perms: ['View tasks only', 'Add comments', 'Cannot edit tasks'] },
            ].map((r) => (
              <div key={r.role} className="p-3 bg-gray-50 rounded-xl">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.color}`}>{r.role}</span>
                <ul className="mt-2 space-y-1">
                  {r.perms.map((p) => (
                    <li key={p} className="text-xs text-gray-500 flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal open={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member" size="sm">
        <form onSubmit={handleInvite} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                className="input-field pl-9"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select className="input-field" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" className="btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={inviting}>
              {inviting && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
