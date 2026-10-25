import React, { useState } from 'react';

export default function PlaceImageGallery({ images = [], name }) {
  const [selected, setSelected] = useState(0);
  const usableImages = images.filter(image => image?.url);
  const cover = usableImages[selected] || usableImages[0];
  return <div>
    <img src={cover?.url || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'} alt={name}
      style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }} />
    {usableImages.length > 1 && <div aria-label="Album ảnh địa điểm" style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
      {usableImages.map((image, index) => <button key={`${image.url}-${index}`} type="button" aria-label={`Xem ảnh địa điểm ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)}
        style={{ padding: 2, border: selected === index ? '2px solid #111827' : '2px solid transparent', borderRadius: 6, flexShrink: 0 }}>
        <img src={image.url} alt={`${name} - ảnh ${index + 1}`} style={{ width: 80, height: 55, objectFit: 'cover', display: 'block' }} />
      </button>)}
    </div>}
  </div>;
}
