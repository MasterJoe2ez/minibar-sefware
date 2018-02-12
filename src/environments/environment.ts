// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC68bGc6uSDn_H_UkdcfNjy-x86Y4HQLdY',
    authDomain: 'minibarcontrol.firebaseapp.com',
    databaseURL: 'https://minibarcontrol.firebaseio.com',
    projectId: 'minibarcontrol',
    storageBucket: 'minibarcontrol.appspot.com',
    messagingSenderId: '44171716940'
  },
  // api: 'https://us-central1-sefware-pos.cloudfunctions.net'
};
