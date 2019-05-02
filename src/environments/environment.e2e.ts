import {RandomString} from '../app/shared/functions/generate-random-string';

const redirect_uri = window.location.protocol + '//' + window.location.host + '/projects';
const oauth = 'https://dev.kubermatic.io/dex/auth';
const scope: string[] = ['openid', 'email', 'profile', 'groups'];
const nonceString = RandomString(32);

export const environment = {
  name: 'dev',
  production: false,
  configUrl: '../../assets/config/config.json',
  gitVersionUrl: '../../assets/config/git-version.json',
  customCSS: '../../assets/custom/style.css',
  refreshTimeBase: 1000,  // Unit: ms
  restRoot: 'api/v1',
  restRootV3: 'api/v3',
  digitalOceanRestRoot: 'https://api.digitalocean.com/v2',
  oidcProviderUrl: oauth + '?response_type=id_token&client_id=kubermatic&redirect_uri=' + redirect_uri +
      '&scope=' + scope.join(' ') + '&nonce=' + nonceString,
};
