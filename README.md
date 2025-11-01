# Stichting Shinqiet – Onepager Website

Dit project bevat een statische onepager website voor Stichting Shinqiet, gebouwd met pure HTML, CSS en JavaScript.

## Snel starten (statische site)

1.  **Vervang de placeholders:**
    -   Vervang `assets/logo.png` met het echte logo.
    -   Vervang `assets/hero.jpg` met een passende hero-afbeelding.

2.  **Start een lokale webserver:**
    Omdat de site ES Modules (`<script type="module">`) gebruikt, moet je deze via een webserver openen, niet direct als `file:///...`.

    -   **Met Python:**
        ```sh
        python3 -m http.server 5173
        ```

    -   **Met Node.js (vereist `http-server`):**
        ```sh
        npx http-server -p 5173 .
        ```
    Open vervolgens `http://localhost:5173` in je browser.

## Donaties via Stripe

### Optie 1: Vaste Betaallink (makkelijkst)

1.  Maak een "Payment Link" aan in je Stripe Dashboard.
2.  Open `assets/app.js`.
3.  Vervang de placeholder URL in de regel `paymentLink.href = '...'` met jouw echte Stripe Payment Link.

### Optie 2: Dynamische Checkout (geavanceerd)

Met deze optie kunnen gebruikers zelf een bedrag kiezen op de site.

1.  **Installeer dependencies:**
    Navigeer naar de `shinqietstichting` map en voer uit:
    ```sh
    npm install express stripe
    ```

2.  **Stel je Stripe Secret Key in:**
    Haal je **Test** Secret Key op uit het Stripe Dashboard (begint met `sk_test_...`).

3.  **Start de server:**
    Voer het volgende commando uit in je terminal, waarbij je de placeholder vervangt door je key:
    ```sh
    # STRIPE_SECRET_KEY="sk_test_XXXXXXXXXXXXXXXXXXXXXXXX" node api/server.js
    ```

De server draait nu op `http://localhost:5173` en de donatieknop zal de dynamische checkout-sessie gebruiken.