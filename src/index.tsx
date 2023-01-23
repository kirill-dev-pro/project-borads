import App from './App'
import { Router } from '@solidjs/router'

import { render } from 'solid-js/web'
import './index.css'

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root'),
)
