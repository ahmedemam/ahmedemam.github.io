(function () {
  var dialog = document.getElementById('resume-dialog');
  if (!dialog) return;

  var form = document.getElementById('resume-form');
  var done = document.getElementById('resume-done');
  var doneMsg = document.getElementById('resume-done-msg');
  var err = document.getElementById('resume-err');
  var endpoint = dialog.getAttribute('data-endpoint');
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

    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email, role: role, company: company, _subject: 'Résumé request from ' + email })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        success("I'll send my résumé to " + email + ". Check your inbox, and if you'd like to talk, book a call anytime.");
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
