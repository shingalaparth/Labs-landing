import { ArrowIcon, MagneticButton } from '@/components/ui/MagneticButton';
import { assurances, fitCriteria } from '@/data/offer';
import { primaryCta, site } from '@/data/site';

export function Assurance({ showFitCriteria = true, sectionNumber = '06' }: { showFitCriteria?: boolean; sectionNumber?: string }) {
  return (
    <section id="assurance" className="assurance-section section-space" aria-labelledby="assurance-title">
      <div className="shell">
        <div className="section-intro">
          <span className="section-label">
            <span>{sectionNumber} /</span> What you are not risking
          </span>
          <div>
            <h2 id="assurance-title" className="section-title">
              The part everyone<br />
              <span className="muted-heading">is actually worried about.</span>
            </h2>
            <p className="section-description">
              Not whether it works. Whether you get stuck with it — an open-ended retainer, a system you cannot run
              without us, accounts you do not own. Here are the 3 commitments in plain terms, before you have to ask.
            </p>
          </div>
        </div>
        <ol className="assurance-list">
          {assurances.map((item, index) => (
            <li key={item.title}>
              <span className="assurance-mark" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        {showFitCriteria && <div className="fit-grid">
          <div className="fit-column">
            <h3>Worth 30 minutes if</h3>
            <ul className="fit-yes">
              {fitCriteria.yes.map(item => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="fit-column">
            <h3>Not yet, if</h3>
            <ul className="fit-no">
              {fitCriteria.no.map(item => (
                <li key={item}>
                  <span aria-hidden="true">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>}
        <div className="assurance-cta">
          <p>Not sure which workflow to start with? That is what the free 30-minute audit is for — we rank them for you.</p>
          <MagneticButton href={site.bookingUrl} variant="primary" strength={0.12} trackingLocation="assurance">
            {primaryCta.label} <ArrowIcon />
          </MagneticButton>
          <ul className="cta-reducers" aria-label="What the audit involves">
            {primaryCta.reducers.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
