import { site } from '@/data/site';
import { useEffect, useRef } from 'react';
import { useLenis } from '@/components/providers/SmoothScrollProvider';

const popupSessionKey = 'mehul-labs:lead-popup-shown';

export function LeadCapturePopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const retryRef = useRef<number | null>(null);
  const lenis = useLenis();
  const auditHref = site.bookingUrl;

  useEffect(() => {
    let cancelled = false;

    function showWhenReady() {
      if (cancelled || sessionStorage.getItem(popupSessionKey)) return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const anotherDialogIsOpen = Array.from(document.querySelectorAll<HTMLDialogElement>('dialog[open]'))
        .some(item => item !== dialog);
      if (anotherDialogIsOpen) {
        retryRef.current = window.setTimeout(showWhenReady, 2500);
        return;
      }
      dialog.showModal();
      sessionStorage.setItem(popupSessionKey, '1');
      lenis?.stop();
    }

    const timer = window.setTimeout(showWhenReady, 5000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (retryRef.current) window.clearTimeout(retryRef.current);
      lenis?.start();
    };
  }, [lenis]);

  function closePopup() {
    dialogRef.current?.close();
    lenis?.start();
  }

  return (
    <dialog
      ref={dialogRef}
      className="lead-popup"
      aria-labelledby="lead-popup-title"
      aria-describedby="lead-popup-description"
      onCancel={closePopup}
      onClose={() => lenis?.start()}
      onClick={event => { if (event.target === event.currentTarget) closePopup(); }}
    >
      <button type="button" className="lead-popup-close" onClick={closePopup} aria-label="Close offer">×</button>
      <p className="lead-popup-kicker"><span aria-hidden="true" /> Before you go deeper</p>
      <h2 id="lead-popup-title">Find the leak.<br /><span>Or take the playbook.</span></h2>
      <p id="lead-popup-description">Two ways to find where the money is going. Both free, neither needs your email.</p>
      <div className="lead-popup-actions">
        <a href={auditHref} onClick={closePopup} data-cta-location="timed-popup-audit">
          <span><strong>Get my free leak audit</strong><small>30 minutes · no obligation</small></span>
          <span className="lead-popup-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg></span>
        </a>
        <a href="/D2C Revenue Leak Map.pdf" download onClick={closePopup} data-cta-location="timed-popup-pdf">
          <span><strong>Get the D2C Revenue Leak Map</strong><small>Download the practical guide</small></span>
          <span className="lead-popup-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg></span>
        </a>
      </div>
      <p className="lead-popup-note">No email gate. Pick what is useful.</p>
    </dialog>
  );
}
