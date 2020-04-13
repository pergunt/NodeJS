const form = document.forms[0];
const users = document.querySelector('.users');

const request = async (path, {method = 'GET', ...rest} = {}) => {
  return await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    ...rest
  })
    .then(async r => {
      const resp = await r.json();
      if (r.status !== 200) {
        throw resp;
      }
      return resp;
    })
};

form.addEventListener('submit', ev => {
  ev.preventDefault();
  const {target: {elements}} = ev;
  request('/users', {
    method: 'post',
    body: JSON.stringify({
      name: elements.name.value,
      email: elements.email.value
    })
  })
    .then(resp => {
      const li = document.createElement('li');
      li.textContent = `${resp.name} -- ${resp.email}`;
      users.append(li);
      console.log(resp)
    })
    .catch(err => {
      err.name && elements.name.classList.add('error');
      err.email && elements.email.classList.add('error');
    });
})
