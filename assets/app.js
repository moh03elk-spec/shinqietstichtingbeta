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

    // Close mobile menu when a menu item is clicked
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.setAttribute('data-visible', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      });
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
  const donationPresets = document.querySelectorAll('.donation-presets .btn-preset'); // Select only numerical presets
  const amountInput = document.getElementById('amount');
  const manualInputToggle = document.getElementById('manual-input-toggle');
  const donationInputGroup = document.querySelector('.donation-input-group');

  if (donationPresets.length > 0 && amountInput && manualInputToggle && donationInputGroup) {
    // Function to deactivate all preset buttons
    const deactivatePresets = () => {
      donationPresets.forEach(btn => btn.classList.remove('active'));
    };

    // Event listener for numerical preset buttons
    donationPresets.forEach(button => {
      button.addEventListener('click', () => {
        amountInput.value = button.dataset.amount;
        deactivatePresets();
        button.classList.add('active');
        donationInputGroup.classList.remove('hidden'); // Always show input group when a preset is clicked
      });
    });

    // Event listener for "Ander bedrag handmatig invoeren" button
    manualInputToggle.addEventListener('click', () => {
      donationInputGroup.classList.toggle('hidden');
      deactivatePresets();
      if (!donationInputGroup.classList.contains('hidden')) {
        amountInput.value = ''; // Clear input when showing manual input
        amountInput.focus();
      } else {
        // If manual input is hidden, set a default amount and activate it
        amountInput.value = '10';
        const defaultPreset = document.querySelector('.btn-preset[data-amount="10"]');
        if (defaultPreset) {
          defaultPreset.classList.add('active');
        }
      }
    });

    // Event listener for manual amount input
    amountInput.addEventListener('input', () => {
      deactivatePresets(); // Deactivate presets when user types
    });

    // Set initial active state and visibility
    const initialAmount = amountInput.value;
    const initialActiveButton = document.querySelector(`.btn-preset[data-amount="${initialAmount}"]`);
    if (initialActiveButton) {
      initialActiveButton.classList.add('active');
      donationInputGroup.classList.remove('hidden'); // Ensure visible
    } else {
      // If initial amount doesn't match a preset, ensure manual input is visible and set a default
      deactivatePresets();
      donationInputGroup.classList.remove('hidden');
      amountInput.value = '10';
    }
  }

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

  // --- Typewriter Effect ---
  function typeWriter(element, text, speed) {
    let i = 0;
    element.textContent = ''; // Clear existing text
    const targetPhrase = "Stichting Shinqiet";
    const highlightClass = "highlight-text";

    let processedText = text;
    // Conditionally add <br> tags for mobile
    if (window.innerWidth <= 720) { // Check for mobile screen size
      processedText = processedText.replace("Welkom bij", "Welkom bij<br>");
      processedText = processedText.replace("Stichting Shinqiet", "Stichting Shinqiet<br>");
    }

    function type() {
      if (i < processedText.length) {
        // Check if the next characters form a <br> tag
        if (processedText.substring(i, i + 4) === '<br>') {
          element.innerHTML += '<br>';
          i += 4; // Skip the <br> characters
        } else {
          element.textContent += processedText.charAt(i);
          i++;
        }
        setTimeout(type, speed);
      } else {
        // After typing is complete, apply highlighting
        const currentText = element.textContent;
        const highlightedHtml = currentText.replace(targetPhrase, `<span class="${highlightClass}">${targetPhrase}</span>`);
        element.innerHTML = highlightedHtml;
      }
    }
    type();
  }

  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle && heroTitle.dataset.typeText) {
    typeWriter(heroTitle, heroTitle.dataset.typeText, 75);
  }
});