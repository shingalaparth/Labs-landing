import './Footer.css';
import { site } from '@/data/site';

interface Props {
  ctaLocation?: string;
}

export function Footer({ ctaLocation = 'footer' }: Props) {
  return (
    <footer id="footer" className="hive-footer">
      <div className="hive-footer__content">
        <div className="hive-footer__story">
         <h2>Every part of your brand,<br />working together.</h2>
          <p className="hive-footer__description">Store conversion, order operations and AI marketing — on one layer that reads your live orders. Start with a free 30-minute audit; the ranked list of leaks is yours to keep.</p>
          <a className="hive-footer__cta" href={site.bookingUrl} data-cta-location={ctaLocation}>
            <span>Book my free audit call</span>
            <span className="hive-footer__cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
            </span>
          </a>
        </div>
        <div className="hive-footer__side">
          <a className="hive-footer__logo" href="/" aria-label="MlabsGrowth home">
            <span>Mlabs</span>Growth
          </a>
          <div className="hive-footer__columns">
            <nav aria-label="Explore">
              <span className="hive-footer__column-label">Explore</span>
              <a href="/services">Services</a>
              <a href="/products">Products</a>
              <a href="/tools">Free tools</a>
            </nav>
            <nav aria-label="Company">
              <span className="hive-footer__column-label">Company</span>
              <a href="/about">About us</a>
              <a href="/offers">Pricing &amp; scope</a>
              <a href="/blog">Journal</a>
            </nav>
          </div>
        </div>
      </div>
      <div className="hive-footer__garden" aria-hidden="true">
        <img className="hive-footer__landscape" src="/footer-garden.webp" width="1920" height="695" alt="" loading="lazy" decoding="async" />
        <img className="hive-footer__bee hive-footer__bee--shopify" src="/footer-shopify-bee.webp" width="240" height="240" alt="" loading="lazy" decoding="async" />
        <img className="hive-footer__bee hive-footer__bee--queen" src="/footer-queen.webp" width="420" height="420" alt="" loading="lazy" decoding="async" />
        <img className="hive-footer__bee hive-footer__bee--marketing" src="/footer-marketing-bee.webp" width="240" height="240" alt="" loading="lazy" decoding="async" />
      </div>
    </footer>
  );
}
