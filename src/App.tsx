import AgentPayDashboard from './AgentPayDashboard';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AgentPayDashboard />
    </ErrorBoundary>
  )
}

export default App
