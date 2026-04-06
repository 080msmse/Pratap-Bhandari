'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Save, Building2, CreditCard, Zap, Check, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['Up to 3 projects', '5 team members', 'Basic boards', 'Community support'],
    cta: 'Current Plan',
    current: true,
    color: 'border-gray-200',
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/user/mo',
    features: ['Unlimited projects', 'Unlimited members', 'Advanced analytics', 'Priority support', 'Timeline view', 'Custom fields'],
    cta: 'Upgrade to Pro',
    current: false,
    color: 'border-brand-500',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Everything in Pro', 'SSO / SAML', 'Audit logs', 'SLA guarantee', 'Dedicated success manager', 'Custom integrations'],
    cta: 'Contact Sales',
    current: false,
    color: 'border-gray-200',
  },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [companyName, setCompanyName] = useState(session?.user?.companyName ?? '')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'integrations'>('general')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast.success('Settings saved!')
  }

  return (
    <div>
      <Header title="Settings" />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(['general', 'billing', 'integrations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-500" />
                Workspace Settings
              </h2>
              <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input
                    className="input-field"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Slug</label>
                  <input
                    className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
                    value={companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    readOnly
                  />
                  <p className="text-xs text-gray-400 mt-1">Used in your workspace URL. Cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                  <select className="input-field">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                    <option>Asia/Kathmandu</option>
                    <option>Asia/Tokyo</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </form>
            </div>

            {/* Danger zone */}
            <div className="card p-6 border-red-100">
              <h2 className="text-base font-semibold text-red-600 mb-3">Danger Zone</h2>
              <p className="text-sm text-gray-500 mb-4">
                Once you delete a workspace, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Delete Workspace
              </button>
            </div>
          </div>
        )}

        {/* Billing */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="card p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">Free</p>
                <p className="text-sm text-gray-400">3 projects · 5 members</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`card p-5 relative ${plan.highlight ? 'border-brand-500 border-2' : ''}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                    disabled={plan.current}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Slack', desc: 'Get task notifications in Slack channels', icon: '💬', connected: false },
              { name: 'GitHub', desc: 'Link pull requests to tasks', icon: '🐙', connected: false },
              { name: 'Google Drive', desc: 'Attach files from Google Drive', icon: '📂', connected: false },
              { name: 'Jira', desc: 'Sync tasks with Jira issues', icon: '🔵', connected: false },
              { name: 'Zapier', desc: 'Automate workflows with 5000+ apps', icon: '⚡', connected: false },
              { name: 'Figma', desc: 'Embed design previews in tasks', icon: '🎨', connected: false },
            ].map((integration) => (
              <div key={integration.name} className="card p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{integration.name}</p>
                  <p className="text-xs text-gray-400 truncate">{integration.desc}</p>
                </div>
                <button className={integration.connected ? 'btn-secondary text-xs' : 'btn-primary text-xs'}>
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
