export const oktaConfig = {
    clientId: '0oafofj7jkbMMhjK45d7',
    issuer: 'https://dev-71768927.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}
