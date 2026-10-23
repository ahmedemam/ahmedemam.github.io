# Résumé request emails (EmailJS)

The site is static (GitHub Pages), so the popup sends mail through EmailJS from the browser.

1. Create a free account at emailjs.com.
2. Email Services > Add service > Gmail > connect ahmedabdelazizemam@gmail.com. Copy the **Service ID**.
3. Email Templates > Create. Paste `notification-template.html` into the HTML editor, then set:
   - **To Email:** `ahmedabdelazizemam@gmail.com, ahmed.emam@masteryhub-its.com`
   - **Reply To:** `{{from_email}}`
   - **Subject:** `Résumé request: {{role}} ({{from_email}})`
   Copy the **Template ID**.
4. Account > General: copy the **Public Key**.
5. Account > Security: restrict allowed origins to `https://ahmedemam.github.io`, and set a rate limit.
6. Put the three values in `_config.yml` under `emailjs:`.
