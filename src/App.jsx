import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photos', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`The photos API returned status ${response.status}.`)
        }

        const photoData = await response.json()
        if (!Array.isArray(photoData)) {
          throw new Error('The photos API returned an invalid response.')
        }

        setPhotos(photoData)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setApiError(error instanceof Error ? error.message : 'Unable to load photos.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchPhotos()
    return () => controller.abort()
  }, [])

  const visiblePhotos = activeCategory === 'All'
    ? photos
    : photos.filter((photo) => photo.category === activeCategory)

  return (
    <main className="gallery-page">
      <div className="gallery-shell">
        <header className="gallery-header">
          <div className="brand-mark" aria-hidden="true">𖤓</div>
          <p className="eyebrow">MY REATPRO</p>
          <h1>Nature &amp; Cities</h1>
          <p className="gallery-intro">
            Quiet landscapes and beautiful city views.
          </p>
          <div className="gallery-count">
            <span className="count-dot" aria-hidden="true" />
            {isLoading ? 'Gathering photos...' : `${visiblePhotos.length} photos`}
          </div>
        </header>

        <section className="photo-section" aria-label="Photo collection">
          {!isLoading && !apiError && (
            <nav className="category-filters" aria-label="Filter photos">
              {['All', 'Nature', 'City'].map((category) => (
                <button
                  className={`category-filter${activeCategory === category ? ' is-active' : ''}`}
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'City' ? 'Cities' : category === 'All' ? 'All photos' : category}
                </button>
              ))}
            </nav>
          )}
          {isLoading && (
            <div className="photo-grid" aria-label="Loading photos">
              {Array.from({ length: 12 }, (_, index) => (
                <div className="photo-skeleton" key={index} />
              ))}
            </div>
          )}
          {apiError && <p className="api-error" role="alert">{apiError}</p>}
          {!isLoading && !apiError && (
            <ul className="photo-grid">
              {visiblePhotos.map((photo, index) => (
                <li className="photo-card" key={photo.id}>
                  <img
                    src={photo.url}
                    alt={`${photo.category} photo ${index + 1}`}
                    loading={index < 8 ? 'eager' : 'lazy'}
                  />
                  <span className="photo-number" aria-hidden="true">
                    {photo.category === 'Nature' ? 'NATURE' : 'CITY'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <footer className="gallery-footer"> ..............rectme...............</footer>
      </div>
    </main>
  )
}

export default App
