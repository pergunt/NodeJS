/*
const form = document.forms[0];

form.addEventListener('submit', async ev => {
  ev.preventDefault();
  const {
    target,
    target: {
      elements: {
        _csrf,
        email,
        password
      }
    }
  } = ev;
  const request = await fetch(target.action, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password,
      _csrf:  _csrf.value
    })
  });
  if (request.status === 200) {
    location.href = '/';
  }
});
*/
