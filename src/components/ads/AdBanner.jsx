import { useState, useEffect } from 'react';

export default function AdBanner({ placement = 'sidebar' }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/ads?placement=${placement}`)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        const ads = d.ads || [];
        setAd(ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [placement]);

  if (!ad) return null;

  return (
    <div className={`ad-banner ad-${placement}`}>
      <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer">
        <img src={ad.image_url} alt={ad.title} loading="lazy" />
        {placement === 'inline' && <span className="ad-label">{ad.title}</span>}
      </a>
      <span className="ad-sponsored">Publicité</span>
    </div>
  );
}
