import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot, Radio, PhoneCall, Clock, AlertTriangle, CheckCircle2,
  Wifi, WifiOff, RefreshCw, Zap, Activity, ChevronRight,
  Video, RotateCcw, XCircle, CircleDot, Timer
} from 'lucide-react'
import { botInstances, botMeetings, botEvents, botMetrics } from '@/data/bots'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { BotStatus } from '@/data/types'

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------
const statusConfig: Record<BotStatus, { label: string; color: string; bg: string; icon: typeof Bot; pulse?: boolean }> = {
  idle: { label: 'Idle', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', icon: Bot },
  queued: { label: 'Queued', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: Clock },
  waiting_room: { label: 'Waiting Room', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Timer, pulse: true },
  in_call: { label: 'In Call', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: PhoneCall, pulse: true },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', icon: XCircle },
  retrying: { label: 'Retrying', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', icon: RefreshCw, pulse: true },
}

const eventIcons: Record<string, typeof Bot> = {
  assigned: Bot,
  joined_waiting_room: Timer,
  admitted: CheckCircle2,
  recording: Radio,
  left_call: PhoneCall,
  failed: XCircle,
  retry: RotateCcw,
}

function StatCard({ label, value, icon: Icon, accent, pulse, subtext }: {
  label: string; value: number | string; icon: typeof Bot; accent: string; pulse?: boolean; subtext?: string
}) {
  return (
    <div className={cn('relative rounded-xl border p-5 overflow-hidden', accent)}>
      {pulse && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-current" />
          </span>
        </div>
      )}
      <Icon className="h-5 w-5 mb-2 opacity-60" />
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-sm font-medium mt-0.5">{label}</p>
      {subtext && <p className="text-xs opacity-60 mt-0.5">{subtext}</p>}
    </div>
  )
}

export default function BotCommandCentrePage() {
  const [selectedStatus, setSelectedStatus] = useState<BotStatus | 'all'>('all')
  const m = botMetrics

  const filteredBots = selectedStatus === 'all'
    ? botInstances
    : botInstances.filter((b) => b.status === selectedStatus)

  const upcomingMeetings = botMeetings
    .filter((mtg) => mtg.status === 'upcoming' || mtg.status === 'in_progress')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 6)

  const recentEvents = [...botEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  const failedBots = botInstances.filter((b) => b.status === 'failed')

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bot Command Centre</h1>
              <p className="text-blue-200/80 text-sm">Real-time meeting bot operations & monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-emerald-300 font-medium">System Operational</span>
            <span className="text-xs text-white/40 ml-2">Last updated: just now</span>
          </div>
        </div>
      </div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="In Calls"
          value={m.inCalls}
          icon={PhoneCall}
          accent="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
          pulse
          subtext="Recording"
        />
        <StatCard
          label="Waiting Room"
          value={m.inWaitingRoom}
          icon={Timer}
          accent="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300"
          pulse
          subtext="Awaiting admission"
        />
        <StatCard
          label="Queued"
          value={m.queued}
          icon={Clock}
          accent="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
          subtext="Next meetings"
        />
        <StatCard
          label="Completed Today"
          value={m.completedToday}
          icon={CheckCircle2}
          accent="border-slate-200 dark:border-slate-800 bg-card text-foreground"
          subtext={`${m.successRate}% success rate`}
        />
        <StatCard
          label="Failed Today"
          value={m.failedToday}
          icon={XCircle}
          accent={m.failedToday > 0
            ? 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
            : 'border-slate-200 dark:border-slate-800 bg-card text-foreground'
          }
          subtext={m.failedToday > 0 ? 'Needs attention' : 'All clear'}
        />
      </div>

      {/* Performance Metrics Bar */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{m.successRate}%</span>
              <span className="text-xs text-emerald-500 font-medium">↑ 2% from last week</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${m.successRate}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Wait Time</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{Math.round(m.avgWaitTime / 60)}</span>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">From queue to admission</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Call Duration</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{m.avgCallDuration}</span>
              <span className="text-sm text-muted-foreground">min</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average recording length</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bots Idle</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{m.botsIdle}</span>
              <span className="text-sm text-muted-foreground">available</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready for assignment</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Bot Status + Upcoming Meetings (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Bots */}
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Bot Instances
              </h3>
              <div className="flex gap-1">
                {(['all', 'in_call', 'waiting_room', 'queued', 'failed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      selectedStatus === s
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {s === 'all' ? 'All' : s === 'in_call' ? 'In Call' : s === 'waiting_room' ? 'Waiting' : s === 'queued' ? 'Queued' : 'Failed'}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y">
              {filteredBots.map((bot) => {
                const cfg = statusConfig[bot.status]
                const StatusIcon = cfg.icon
                return (
                  <div key={bot.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', cfg.bg)}>
                      <StatusIcon className={cn('h-4 w-4', cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{bot.meetingName}</p>
                      <p className="text-xs text-muted-foreground">
                        {bot.id} • {formatRelativeTime(bot.assignedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cfg.pulse && (
                        <span className="flex h-2 w-2">
                          <span className={cn('animate-ping absolute h-2 w-2 rounded-full opacity-75', cfg.color.replace('text-', 'bg-'))} />
                          <span className={cn('relative rounded-full h-2 w-2', cfg.color.replace('text-', 'bg-'))} />
                        </span>
                      )}
                      <Badge variant="secondary" className={cn('text-[10px]', cfg.color)}>
                        {cfg.label}
                      </Badge>
                      {bot.status === 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toast.info(`Retrying ${bot.id}...`)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
              {filteredBots.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No bots with status "{selectedStatus}"
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="rounded-xl border bg-card">
            <div className="p-5 pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Video className="h-4 w-4" />
                Upcoming & Active Meetings
              </h3>
            </div>
            <div className="divide-y">
              {upcomingMeetings.map((mtg) => (
                <div key={mtg.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                    mtg.status === 'in_progress' ? 'bg-emerald-100 dark:bg-emerald-950/30' : 'bg-muted'
                  )}>
                    {mtg.status === 'in_progress' ? (
                      <Radio className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mtg.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(mtg.scheduledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • {mtg.platform}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {mtg.botAssigned ? (
                      <Badge variant="secondary" className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        <Bot className="h-3 w-3 mr-1" />
                        Assigned
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => toast.info('Assigning bot...')}
                      >
                        Assign Bot
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Activity Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Feed */}
          <div className="rounded-xl border bg-card">
            <div className="p-5 pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Live Activity Feed
                <span className="flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              </h3>
            </div>
            <div className="divide-y max-h-[420px] overflow-y-auto">
              {recentEvents.map((evt) => {
                const EvtIcon = eventIcons[evt.event] ?? Bot
                const isError = evt.event === 'failed'
                return (
                  <div key={evt.id} className="flex items-start gap-3 px-5 py-2.5">
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5',
                      isError ? 'bg-red-100 dark:bg-red-950/30' : 'bg-muted'
                    )}>
                      <EvtIcon className={cn('h-3 w-3', isError ? 'text-red-500' : 'text-muted-foreground')} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">
                        <span className="font-medium">{evt.botId}</span>
                        <span className="text-muted-foreground"> — {evt.details}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {evt.meetingName} • {formatRelativeTime(evt.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Failures Panel */}
          {failedBots.length > 0 && (
            <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10">
              <div className="p-5 pb-3">
                <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Failed Bots
                </h3>
              </div>
              <div className="divide-y divide-red-100 dark:divide-red-900/50">
                {failedBots.map((bot) => (
                  <div key={bot.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{bot.meetingName}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-red-200 dark:border-red-800"
                        onClick={() => toast.info(`Retrying ${bot.id}...`)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">{bot.errorMessage}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {bot.retryCount} retries • {bot.id}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
