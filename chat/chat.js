const form = document.forms[0];

form.onsubmit = e => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/publish', true);
  const msg = JSON.stringify({
    message: e.target.elements.message.value
  });
  xhr.send(msg);
  e.target.elements.message.value = '';
  return false;
}

subscribe();

function subscribe() {
  const xhr = new XMLHttpRequest();
  console.log('subscrobe');
  xhr.open('GET', '/subscribe', true);

  xhr.onload = function () {
    const li = document.createElement('li');
    li.textContent = this.responseText;
    const ul = document.getElementById('messages');
    ul.appendChild(li);
    subscribe();
  };
  xhr.onerror = xhr.onabort = () => setTimeout(subscribe, 500);
  xhr.send('');
}