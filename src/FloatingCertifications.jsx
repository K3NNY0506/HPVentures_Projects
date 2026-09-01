import { useEffect, useState } from 'react'
import { defaultCertifications, loadCertifications } from './siteContent.js'

function FloatingCertifications() {
  const [certifications, setCertifications] = useState(defaultCertifications)
  const [certIndex, setCertIndex] = useState(0)
  const [selectedCert, setSelectedCert] = useState(null)

  useEffect(() => {
    const refreshCertifications = async () => {
      const loadedCertifications = await loadCertifications()
      if (loadedCertifications && loadedCertifications.length) {
        setCertifications(loadedCertifications)
      }
    }

    refreshCertifications()
    window.addEventListener('site-content-updated', refreshCertifications)

    const certTimer = setInterval(() => {
      setCertIndex((currentIndex) => (currentIndex + 1) % Math.max(certifications.length, 1))
    }, 4000)

    return () => {
      clearInterval(certTimer)
      window.removeEventListener('site-content-updated', refreshCertifications)
    }
  }, [certifications.length])

  useEffect(() => {
    setCertIndex((currentIndex) => currentIndex % Math.max(certifications.length, 1))
  }, [certifications.length])

  if (!certifications.length) return null

  const activeCert = certifications[certIndex % certifications.length]

  return (
    <>
      <div className="floating-certifications" aria-label="Certifications">
        <button
          type="button"
          className="cert-display"
          onClick={() => setSelectedCert(activeCert)}
          aria-label="Open certification"
        >
          <img src={activeCert} alt="Certification" />
        </button>
      </div>

      {selectedCert && (
        <div className="cert-modal" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="cert-modal-close" onClick={() => setSelectedCert(null)} aria-label="Close certificate">×</button>
            <img src={selectedCert} alt="Certificate preview" />
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingCertifications
