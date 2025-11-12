import React, { Suspense } from 'react'
import "./App.css";
// ** Router Import
import Router from './Router/AppRoutes'

const App = () => {
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
