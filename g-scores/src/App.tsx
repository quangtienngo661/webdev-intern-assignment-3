import { AlertBanner } from './components/AlertBanner'
import { DashboardHeader } from './components/DashboardHeader'
import { ScoreDistributionCard } from './components/ScoreDistributionCard'
import { ScoreLookupCard } from './components/ScoreLookupCard'
import { TopGroupATable } from './components/TopGroupATable'
import { useDashboardData } from './hooks/useDashboardData'
import { useScoreSearch } from './hooks/useScoreSearch'

function App() {
  const dashboard = useDashboardData()
  const scoreSearch = useScoreSearch()

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f7fb]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader
          isLoading={dashboard.isDashboardLoading}
          onRefresh={() => void dashboard.loadDashboard()}
        />

        {dashboard.dashboardError ? (
          <AlertBanner message={dashboard.dashboardError} />
        ) : null}

        <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ScoreLookupCard
            isSearching={scoreSearch.isSearching}
            onQueryChange={scoreSearch.setQuery}
            onSubmit={scoreSearch.searchScore}
            query={scoreSearch.query}
            result={scoreSearch.scoreResult}
            searchError={scoreSearch.searchError}
          />

          <ScoreDistributionCard
            isLoading={dashboard.isDashboardLoading}
            reports={dashboard.reports}
          />
        </section>

        <TopGroupATable
          isLoading={dashboard.isDashboardLoading}
          students={dashboard.topStudents}
        />
      </div>
    </main>
  )
}

export default App
