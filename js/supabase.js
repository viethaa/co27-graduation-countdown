(function (Roll) {
  'use strict';

  const c = Roll.CONFIG;
  const configured = /^https:\/\/.+\.supabase\.co$/.test(c.supabaseUrl) &&
    c.supabaseAnonKey && !c.supabaseAnonKey.startsWith('YOUR_');

  Roll.backend = {
    configured,
    client: configured && window.supabase
      ? window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey)
      : null,
    user: null
  };
})(window.Roll);
