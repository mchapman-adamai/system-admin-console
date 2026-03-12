import { FileText, Loader2, CheckCircle2, XCircle, Clock, Zap, Activity, RotateCcw, AlertTriangle, Star, FileCheck, Timer, BarChart3 } from 'lucide-react'
import { minutesJobs, minutesMetrics } from '@/data/minutes'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { MinutesStatus } from '@/data/types'

const statusConfig: Record<MinutesStatus, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  queued: { label: 'Queued', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: Clock },
  processing: { label: 'Processing', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Loader2 },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', icon: XCircle },
  reviewing: { label: 'Reviewing', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30', icon: FileCheck },
}

function StatCard({ label, value, icon: Icon, accent, pulse, subtext }: {
  label: string; value: number | string; icon: typeof FileText; accent: string; pulse?: boolean; subtext?: string
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

function QualityBar({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-medium w-8 text-right">{score}%</span>
    </div>
  )
}

export default function MinutesCommandCentrePage() {
  const m = minutesMetrics

  const processing = minutesJobs.filter((j) => j.status === 'processing')
  const queued = minutesJobs.filter((j) => j.status === 'queued')
  const failed = minutesJobs.filter((j) => j.status === 'failed')
  const completed = minutesJobs
    .filter((j) => j.status === 'completed')
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-violet-950 to-purple-950 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Minutes Processing Centre</h1>
              <p className="text-violet-200/80 text-sm">AI-powered meeting minutes generation & quality control</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-emerald-300 font-medium">Processing Engine Active</span>
            <span className="text-xs text-white/40 ml-2">Last updated: just now</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Processing Now"
          value={m.processingNow}
          icon={Loader2}
          accent="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300"
          pulse={m.processingNow > 0}
          subtext="Generating minutes"
        />
        <StatCard
          label="In Queue"
          value={m.queued}
          icon={Clock}
          accent="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
          subtext="Awaiting processing"
        />
        <StatCard
          label="Generated Today"
          value={m.generatedToday}
          icon={CheckCircle2}
          accent="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
          subtext={`${m.totalProcessedThisWeek} this week`}
        />
        <StatCard
          label="Success Rate"
          value={`${m.successRate}%`}
          icon={BarChart3}
          accent="border-slate-200 dark:border-slate-800 bg-card text-foreground"
          subtext="Last 30 days"
        />
        <StatCard
          label="Avg Quality"
          value={`${m.avgQualityScore}%`}
          icon={Star}
          accent="border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300"
          subtext="Quality score"
        />
      </div>

      {/* Performance Bar */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Processing Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Avg Processing Time</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{formatDuration(m.avgProcessingTime)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per meeting recording</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{m.successRate}%</span>
              <span className="text-xs text-emerald-500 font-medium">↑ 3% this month</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${m.successRate}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Quality Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold">{m.avgQualityScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${m.avgQualityScore}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Week</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold">{m.totalProcessedThisWeek}</span>
              <span className="text-sm text-muted-foreground">processed</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Including {m.failedToday} failures today</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column (3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Currently Processing */}
          {processing.length > 0 && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/10">
              <div className="p-5 pb-3">
                <h3 className="font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Currently Processing
                </h3>
              </div>
              <div className="divide-y divide-amber-100 dark:divide-amber-900/30">
                {processing.map((job) => (
                  <div key={job.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{job.meetingName}</p>
                      <Badge variant="secondary" className="text-amber-600 dark:text-amber-400 text-[10px]">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-amber-100 dark:bg-amber-900/30 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500 animate-pulse" style={{ width: '65%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Started {formatRelativeTime(job.startedAt!)} • {job.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Completions */}
          <div className="rounded-xl border bg-card">
            <div className="p-5 pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Recent Completions
              </h3>
            </div>
            <div className="divide-y">
              {completed.map((job) => (
                <div key={job.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{job.meetingName}</p>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(job.completedAt!)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{job.wordCount?.toLocaleString()} words</span>
                    <span>{job.pageCount} pages</span>
                    <span>{formatDuration(job.duration!)}</span>
                  </div>
                  {job.qualityScore && (
                    <div className="mt-2">
                      <QualityBar score={job.qualityScore} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Queue */}
          <div className="rounded-xl border bg-card">
            <div className="p-5 pb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Processing Queue
                {queued.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">{queued.length}</Badge>
                )}
              </h3>
            </div>
            <div className="divide-y">
              {queued.map((job, i) => (
                <div key={job.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{job.meetingName}</p>
                    <p className="text-xs text-muted-foreground">Queued {formatRelativeTime(job.queuedAt)}</p>
                  </div>
                </div>
              ))}
              {queued.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Queue is empty
                </div>
              )}
            </div>
          </div>

          {/* Failures */}
          {failed.length > 0 && (
            <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10">
              <div className="p-5 pb-3">
                <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Failed Processing
                </h3>
              </div>
              <div className="divide-y divide-red-100 dark:divide-red-900/50">
                {failed.map((job) => (
                  <div key={job.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{job.meetingName}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-red-200 dark:border-red-800"
                        onClick={() => toast.info(`Retrying ${job.id}...`)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80">{job.errorMessage}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {job.retryCount} retries • {job.id}
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
