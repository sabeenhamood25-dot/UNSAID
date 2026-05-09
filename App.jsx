import React, { useState, useEffect } from 'react'
import Landing from './Landing.jsx'
import Write from './Write.jsx'
import ThankYou from './ThankYou.jsx'
import Feed from './Feed.jsx'
import Admin from './Admin.jsx'

const PAGES = {
  LANDING: 'landing',
  WRITE: 'write',
  THANKYOU: 'thankyou',
  FEED: 'feed',
  ADMIN: 'admin',
}

export default function App() {
  const [page, setPage] = useState(PAGES.LANDING)
  const [transitioning, setTransitioning] = useState(false)

  const navigate = (to) => {
    setTransitioning(true)
    setTimeout(() => {
      setPage(to)
      setTransitioning(false)
      window.scrollTo(0, 0)
    }, 300)
  }

  return (
    <div style={{
      opacity: transitioning ? 0 : 1,
      transition: 'opacity 0.3s ease',
    }}>
      {page === PAGES.LANDING && (
        <Landing
          onBegin={() => navigate(PAGES.WRITE)}
          onFeed={() => navigate(PAGES.FEED)}
          onAdmin={() => navigate(PAGES.ADMIN)}
        />
      )}
      {page === PAGES.WRITE && (
        <Write
          onBack={() => navigate(PAGES.LANDING)}
          onSubmitted={() => navigate(PAGES.THANKYOU)}
        />
      )}
      {page === PAGES.THANKYOU && (
        <ThankYou
          onHome={() => navigate(PAGES.LANDING)}
        />
      )}
      {page === PAGES.FEED && (
        <Feed
          onBack={() => navigate(PAGES.LANDING)}
        />
      )}
      {page === PAGES.ADMIN && (
        <Admin
          onBack={() => navigate(PAGES.LANDING)}
        />
      )}
    </div>
  )
}
