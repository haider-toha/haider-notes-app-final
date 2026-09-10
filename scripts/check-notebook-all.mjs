// One command owns its servers, builds production assets, and runs the contract.
import { spawn } from 'node:child_process';
import { createServer, preview } from 'vite';

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', env: { ...process.env, ...env } });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} failed (${code})`)));
  });
}
const check = (name, origin) => run(process.execPath, [`scripts/check-notebook${name ? `-${name}` : ''}.mjs`], { NOTEBOOK_ORIGIN: origin });
let production, development;
try {
  await run('npm', ['run', 'typecheck']);
  // Check BEFORE building, since building regenerates stale cuts.
  await run('npm', ['run', 'check:pages']);
  await run(process.execPath, ['scripts/check-notebook-content.mjs']);
  await run('npm', ['run', 'build']);
  production = await preview({ preview: { host: '127.0.0.1', port: 4175, strictPort: false } });
  const productionOrigin = production.resolvedUrls.local[0].replace(/\/$/, '');
  for (const name of ['cover', 'contents-animation', '', 'routes', 'history-interruption', 'mobile', 'loose-media', 'figures', 'diagram-legibility', 'modals', 'math', 'tables', 'simulations']) await check(name, productionOrigin);
  if (process.env.NOTEBOOK_WEBKIT === '1') await check('webkit', productionOrigin);
  // These fixtures intentionally import source modules to exercise lifecycle
  // and synthetic internal links. The rest run against the shipped bundle.
  development = await createServer({ server: { host: '127.0.0.1', port: 5175, strictPort: false, hmr: false } });
  await development.listen();
  const developmentOrigin = development.resolvedUrls.local[0].replace(/\/$/, '');
  for (const name of ['links', 'render-loop']) await check(name, developmentOrigin);
  console.log('PASS: complete notebook production and development regression checks.');
} finally {
  await development?.close();
  if (production) await new Promise(resolve => {
    production.httpServer.close(resolve);
    production.httpServer.closeAllConnections();
  });
}
