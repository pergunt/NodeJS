const form = document.forms[0];

form.onsubmit = e => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', window.location.href + '/publish', true);
  const msg = JSON.stringify({
    message: e.target.elements.message.value
  });
  xhr.setRequestHeader('content-type', 'application/json;charset=utf-8');
  xhr.send(msg);
  e.target.elements.message.value = '';
  return false;
};

subscribe();

function subscribe() {
  const xhr = new XMLHttpRequest();
  console.log('subscrobe');
  xhr.open('GET', window.location.href + '/subscribe', true);

  xhr.onload = function () {
    const li = document.createElement('li');
    li.textContent = this.responseText;
    const ul = document.getElementById('messages');
    ul.appendChild(li);
    subscribe();
  };
  xhr.onerror = xhr.onabort = () => setTimeout(subscribe, 1000);
  xhr.send('');
}
