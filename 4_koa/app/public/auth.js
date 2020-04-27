document.addEventListener('DOMContentLoaded', () => {

  const fbLink = document.querySelector('[href="/login/facebook"]');
  if (fbLink) {
    fbLink.addEventListener('click', ev => {
      ev.preventDefault();
      window.fbAsyncInit();
      window.FB.login(function(response) {
        if (response.authResponse) {
          localStorage.setItem('accessToken', response.authResponse.accessToken);
          fetch(`/login/facebook?access_token=${response.authResponse.accessToken}`)
            .then(resp => {
              if (resp.status === 200) {
                location.reload();
              }
              console.log(resp);
            });
          console.log('Welcome!  Fetching your information.... ', response.authResponse);
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'public_profile,email'});
    })
  }
});
// /auth/facebook/token?access_token=<TOKEN_HERE>
