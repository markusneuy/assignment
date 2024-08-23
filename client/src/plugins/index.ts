// Plugins
import vuetify from './vuetify';
import pinia from '../stores';
import router from '../router';

// Types
import type { App } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import queryClient from './query';

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueQueryPlugin, { queryClient });
}
