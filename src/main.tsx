import ReactDOM from 'react-dom/client'

import App from './App'
import {AppProviders} from './context'
import './index.css'

/**
 * Boostrap app
 */

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <AppProviders>
    <App />
  </AppProviders>,
)
