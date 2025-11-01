document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isVisible = mainNav.getAttribute('data-visible') === 'true';
      mainNav.setAttribute('data-visible', !isVisible);
      navToggle.setAttribute('aria-expanded', !isVisible);
    });
  }

  // --- Dropdown Menu Logic ---
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', !isExpanded);
      // Close dropdown if clicking outside
      document.addEventListener('click', (event) => {
        if (!dropdownToggle.parentElement.contains(event.target)) {
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      }, { once: true });
      e.stopPropagation();
    });
  }

  // --- Dynamic Year in Footer ---
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Prayer Times Placeholder ---
  const prayerTimes = { fajr: '05:00', dhuhr: '13:30', asr: '16:00', maghrib: '18:45', isha: '20:00' };
  Object.entries(prayerTimes).forEach(([key, value]) => {
    const el = document.querySelector(`[data-pt="${key}"]`);
    if (el) el.textContent = value;
  });

  // --- Stripe Donation Logic ---
  // 1. Simple Payment Link
  const paymentLink = document.getElementById('payment-link');
  if (paymentLink) {
    paymentLink.href = 'https://buy.stripe.com/test_...'; // VERVANGEN MET ECHTE STRIPE PAYMENT LINK
  }

  // 2. Dynamic Checkout Session
  const donationForm = document.getElementById('donation-form');
  const donateButton = document.getElementById('donate-button');
  if (donationForm && donateButton) {
    donationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      donateButton.setAttribute('disabled', 'true');
      try {
        const amountInput = document.getElementById('amount');
        const amount = Number(amountInput.value) || 10;

        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountEuro: amount }),
        });

        if (!res.ok) throw new Error('Server response not ok');
        
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Kon geen betaalpagina openen. Probeer het later opnieuw.');
        }
      } catch (err) {
        console.error('Donation Error:', err);
        alert('Er ging iets mis bij het verwerken van de donatie.');
      } finally {
        donateButton.removeAttribute('disabled');
      }
    });
  }

  // --- Registration Form Logic ---
  const registrationForm = document.getElementById('aanmeld-formulier');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const voornaam = document.getElementById('voornaam').value;
      const achternaam = document.getElementById('achternaam').value;
      const geboortedatum = document.getElementById('geboortedatum').value;
      const email = document.getElementById('email_aanmelden').value;
      const telefoon = document.getElementById('telefoon').value;
      const activiteit = document.getElementById('activiteit').value;
      const bericht = document.getElementById('bericht_aanmelden').value;

      const subject = `Nieuwe aanmelding voor ${activiteit}`;
      const body = `
        Nieuwe aanmelding ontvangen voor de activiteit: ${activiteit}
        --------------------------------------------------
        Naam: ${voornaam} ${achternaam}
        Geboortedatum: ${geboortedatum}
        E-mail: ${email}
        Telefoonnummer: ${telefoon}
        --------------------------------------------------

        Bericht:
        ${bericht}
      `;

      window.location.href = `mailto:stichtingsseo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});