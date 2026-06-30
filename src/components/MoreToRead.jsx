import React from 'react';

export default function MoreToRead({ data }) {
  return (
    <section className="more-to-read-section">
        <h2 className="section-title">{data.sectionTitle}</h2>
        <div className="cards-grid">
            {data.cards.map(card => (
                card.href ? (
                    <a
                        key={card.id}
                        href={card.href}
                        className="read-card read-card-link"
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                        <div className="card-img-wrapper">
                            <img src={card.image.src} alt={card.image.alt} className="card-img" />
                        </div>
                        <div className="card-content">
                            <h3 className="card-heading">{card.heading}</h3>
                            <p className="card-text">{card.text}</p>
                        </div>
                    </a>
                ) : (
                    <article className="read-card" key={card.id}>
                        <div className="card-img-wrapper">
                            <img src={card.image.src} alt={card.image.alt} className="card-img" />
                        </div>
                        <div className="card-content">
                            <h3 className="card-heading">{card.heading}</h3>
                            <p className="card-text">{card.text}</p>
                        </div>
                    </article>
                )
            ))}
        </div>
    </section>
  );
}
