(function () {
  var dialog = document.getElementById('resume-dialog');
  if (!dialog) return;

  var form = document.getElementById('resume-form');
  var done = document.getElementById('resume-done');
  var doneMsg = document.getElementById('resume-done-msg');
  var err = document.getElementById('resume-err');
  var service = dialog.getAttribute('data-service');
  var template = dialog.getAttribute('data-template');
  var key = dialog.getAttribute('data-key');
  var to = dialog.getAttribute('data-to');

  function reset() {
    form.hidden = false;
    done.hidden = true;
    err.hidden = true;
  }

  function fail(msg) {
    err.textContent = msg;
    err.hidden = false;
  }

  function success(msg) {
    doneMsg.textContent = msg;
    form.hidden = true;
    done.hidden = false;
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-resume-open]')) {
      reset();
      dialog.showModal();
      document.getElementById('remail').focus();
    } else if (e.target.closest('[data-resume-close]')) {
      dialog.close();
    } else if (e.target === dialog) {
      dialog.close(); // click on backdrop
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    var role = (form.role.value || '').trim();
    var company = form.company.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.');
    if (!role) return fail('Let me know who you are.');
    err.hidden = true;

    if (form.website.value) return success('Thanks.'); // honeypot

    if (service && template && key) {
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service,
          template_id: template,
          user_id: key,
          template_params: {
            from_email: email,
            role: role,
            company: company || 'Not provided',
            received: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
          }
        })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        success("Thanks. I review each request personally and will email my résumé to " + email + " shortly. If you'd like to talk sooner, book a call anytime.");
        form.reset();
      }).catch(function () {
        fail('Something went wrong. Please try again, or email me directly.');
      });
      return;
    }

    // No form endpoint configured: hand the request over as a pre-filled email.
    var body = 'Please send me your résumé.\n\nEmail: ' + email + '\nI am a: ' + role + (company ? '\nCompany: ' + company : '');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Résumé request') + '&body=' + encodeURIComponent(body);
    success('Your email app should open with the request ready to send. If it did not, email ' + to + ' directly.');
    form.reset();
  });
})();
