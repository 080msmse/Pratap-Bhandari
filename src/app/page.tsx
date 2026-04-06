import Link from 'next/link'
import {
  Zap,
  LayoutGrid,
  Users,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  Globe,
  Smartphone,
  Layers,
  Bell,
  Calendar,
  MessageSquare,
} from 'lucide-react'

const features = [
  {
    icon: LayoutGrid,
    title: 'Visual Kanban Boards',
    description: 'Drag and drop tasks across customizable columns. See your workflow at a glance and keep every project moving.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite teammates, assign tasks, and collaborate in real time. Role-based permissions keep everyone in the right lane.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: BarChart2,
    title: 'Insightful Reports',
    description: 'Track completion rates, overdue tasks, and team workload. Make data-driven decisions with beautiful dashboards.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Never miss a deadline. Get notified when tasks are assigned, moved, or commented on across all your projects.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Calendar,
    title: 'Calendar View',
    description: 'Visualize all deadlines in a calendar. Plan sprints and milestones across projects in one unified view.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: MessageSquare,
    title: 'Task Comments',
    description: 'Discuss tasks in context with threaded comments. Keep all conversations linked to the work they belong to.',
    color: 'bg-teal-50 text-teal-600',
  },
]

const testimonials = [
  {
    quote: "ProjectFlow replaced three tools we were using. Our team is 40% more productive now.",
    author: 'Sarah Chen',
    role: 'CTO at BuildCo',
    avatar: 'SC',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    quote: "Finally a project management tool that doesn't require a PhD to set up. We were running in 10 minutes.",
    author: 'Marcus Reid',
    role: 'Founder at LaunchPad',
    avatar: 'MR',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    quote: "The Kanban boards and reporting dashboard give our clients exactly the visibility they need.",
    author: 'Priya Nair',
    role: 'PM at DesignStudio',
    avatar: 'PN',
    color: 'bg-green-100 text-green-700',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for small teams getting started.',
    features: ['3 projects', '5 team members', 'Kanban boards', 'Basic reporting', 'Community support'],
    cta: 'Start for free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per user / month',
    description: 'For growing teams that need more power.',
    features: ['Unlimited projects', 'Unlimited members', 'Advanced analytics', 'Timeline view', 'Priority support', 'Custom fields', 'API access'],
    cta: 'Start free trial',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs.',
    features: ['Everything in Pro', 'SSO / SAML', 'Audit logs & compliance', 'SLA guarantee', 'Dedicated manager', 'Custom integrations', 'On-premise option'],
    cta: 'Contact sales',
    href: '/register',
    highlight: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ProjectFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">Customers</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary py-2 text-sm">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6 text-center bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Star className="w-3.5 h-3.5" />
            Trusted by 5,000+ teams worldwide
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Manage any project,
            <br />
            <span className="text-brand-600">your way.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            ProjectFlow brings your team, tasks, and tools together in one place.
            Run projects with full visibility from kickoff to completion — no chaos required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary py-3 px-8 text-base">
              Start for free — no credit card
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-secondary py-3 px-8 text-base">
              View demo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Free forever · No credit card required · Setup in 2 minutes
          </p>
        </div>

        {/* App preview */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-5 bg-gray-200 rounded-md" />
            </div>
            {/* Mock board */}
            <div className="p-6 bg-gray-50 min-h-[360px]">
              <div className="flex gap-4 overflow-x-auto">
                {[
                  { name: 'Backlog', color: '#868e96', tasks: ['Research competitor tools', 'Define MVP scope'] },
                  { name: 'In Progress', color: '#ffd43b', tasks: ['Design new dashboard', 'Build auth system', 'Write API docs'] },
                  { name: 'In Review', color: '#f783ac', tasks: ['Landing page redesign'] },
                  { name: 'Done', color: '#69db7c', tasks: ['Set up project repo', 'Team onboarding'] },
                ].map((col) => (
                  <div key={col.name} className="w-56 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                      <span className="text-xs font-semibold text-gray-600">{col.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-200 px-1.5 rounded-full">{col.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {col.tasks.map((task) => (
                        <div key={task} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                          <p className="text-xs text-gray-700 font-medium leading-snug">{task}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex -space-x-1">
                              <div className="w-5 h-5 rounded-full bg-brand-200 ring-2 ring-white" />
                            </div>
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full">
                              <div className="h-1.5 rounded-full bg-brand-400" style={{ width: '60%' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof logos */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400 mb-8 font-medium uppercase tracking-wider">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            {['Acme Corp', 'BuildCo', 'LaunchPad', 'TechStart', 'DesignStudio', 'GrowthLab'].map((name) => (
              <span key={name} className="text-gray-600 font-bold text-lg">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything your team needs
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From kanban boards to detailed reports — ProjectFlow has all the tools
              to run projects smoothly at any scale.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all bg-white group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Up and running in minutes</h2>
            <p className="text-lg text-gray-500">No training required. Your whole team can be productive from day one.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your workspace', desc: 'Sign up and set up your company workspace in under 2 minutes. Invite your team immediately.' },
              { step: '02', title: 'Set up projects', desc: 'Create projects and customize your board columns to match your exact workflow and process.' },
              { step: '03', title: 'Ship together', desc: 'Add tasks, assign team members, track progress, and deliver projects on time every time.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by teams everywhere</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-500">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-6 relative ${plan.highlight ? 'border-2 border-brand-500 shadow-lg' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-sm text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-10 text-sm text-gray-500">
            {[
              { icon: Shield, text: 'SOC 2 Type II Certified' },
              { icon: Globe, text: 'GDPR Compliant' },
              { icon: Layers, text: '99.9% Uptime SLA' },
              { icon: Smartphone, text: 'Works on all devices' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-brand-500" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-brand-600 to-brand-800 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to run better projects?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Join thousands of teams using ProjectFlow to ship faster and stay organized.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors text-base">
            Get started for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-brand-200 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">ProjectFlow</span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                The modern project management platform for teams that want to move fast without breaking things.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-10 text-sm">
              <div>
                <p className="font-semibold text-white mb-3">Product</p>
                <ul className="space-y-2">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/register" className="hover:text-white transition-colors">Get started</a></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-3">Company</p>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-3">Legal</p>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            © {new Date().getFullYear()} ProjectFlow. Built as a SaaS product demo.
          </div>
        </div>
      </footer>
    </div>
  )
}
