/* Enquiry form. Posts to the Make webhook, then replaces itself with a receipt. */
(function () {
  var form = document.getElementById('enq');
  if (!form) return;

  var WEBHOOK = 'https://hook.eu1.make.com/waciaz78ykdmfaxh4glg6vdhjjqi4jh5';
  var note = document.getElementById('enq-note');
  var submit = document.getElementById('enq-submit');

  function fail(message, field) {
    note.textContent = message;
    note.setAttribute('data-state', 'error');
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = Object.fromEntries(new FormData(form).entries());
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });

    if (!data.name) return fail('Add your name so we know who we are replying to.', form.name);
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return fail('Check the email address — we could not read that one.', form.email);
    }

    note.removeAttribute('data-state');
    note.textContent = 'Sending…';
    submit.setAttribute('aria-busy', 'true');

    data.source = 'jdotai.com/legal';
    data.submitted_at = new Date().toISOString();

    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed: ' + response.status);
        var done = document.createElement('div');
        done.className = 'enq-done';
        done.innerHTML =
          '<h3>Enquiry received.</h3><p>We will be in touch within 24 hours.</p>';
        form.replaceWith(done);
      })
      .catch(function () {
        submit.removeAttribute('aria-busy');
        fail('That did not send. Email jai@jdotai.com and we will pick it up there.');
      });
  });
})();
