import { RootCmp } from './RootCmp.jsx'
const Router = ReactRouterDOM.BrowserRouter

const elContainer = document.getElementById('root')
const root = ReactDOM.createRoot(elContainer)

root.render(
  <Router>
    <RootCmp />
  </Router>
)
