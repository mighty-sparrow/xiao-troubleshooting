import { commonEnv } from './environment.common';

const env: Partial<typeof commonEnv> = {
  environmentName:'development',
};

// Export all settings of common replaced by dev options
export const environment = { ...commonEnv, ...env };
