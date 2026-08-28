const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = process.env.BW_CONTENT_TABLE || 'BwDashboardContent';
const CONNECTION_STRING = process.env.BW_CONTENT_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage || '';
const WRITE_ROLES = ['editor', 'admin'];

function json(status, body) {
  return { status, headers: { 'content-type': 'application/json; charset=utf-8' }, body };
}

function parsePrincipal(req) {
  const raw = req.headers['x-ms-client-principal'];
  if (!raw) return { userRoles: ['anonymous'] };
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  } catch (e) {
    return { userRoles: [] };
  }
}

function roleList(principal) {
  return (principal.userRoles || []).map(r => String(r).toLowerCase());
}

function canWrite(principal) {
  const roles = roleList(principal);
  return roles.includes('admin') || roles.includes('editor');
}

function cleanKey(input) {
  const key = String(input || '').trim();
  if (!key || key.length > 180) return '';
  return key.replace(/[\\/#?\u0000-\u001f\u007f-\u009f]/g, '-');
}

function tableClient() {
  if (!CONNECTION_STRING) return null;
  return TableClient.fromConnectionString(CONNECTION_STRING, TABLE_NAME);
}

module.exports = async function (context, req) {
  const principal = parsePrincipal(req);
  const roles = roleList(principal);

  if (!roles.includes('authenticated') && !roles.includes('viewer') && !roles.includes('editor') && !roles.includes('admin')) {
    context.res = json(401, { error: 'Unauthorised' });
    return;
  }

  const key = cleanKey((req.query && req.query.key) || (req.body && req.body.key));
  if (!key) {
    context.res = json(400, { error: 'Missing or invalid key' });
    return;
  }

  const client = tableClient();
  if (!client) {
    context.res = json(503, { error: 'Storage not configured. Add BW_CONTENT_STORAGE_CONNECTION_STRING to Static Web App configuration.' });
    return;
  }

  try {
    await client.createTable().catch(err => {
      if (err.statusCode !== 409) throw err;
    });

    if (req.method === 'GET') {
      try {
        const entity = await client.getEntity('content', key);
        context.res = json(200, {
          key,
          value: entity.value ? JSON.parse(entity.value) : null,
          updatedAt: entity.updatedAt || null,
          updatedBy: entity.updatedBy || null
        });
      } catch (err) {
        if (err.statusCode === 404) context.res = json(200, { key, value: null });
        else throw err;
      }
      return;
    }

    if (req.method === 'POST') {
      if (!canWrite(principal)) {
        context.res = json(403, { error: 'Editor or admin role required' });
        return;
      }
      const value = req.body ? req.body.value : undefined;
      if (value === undefined) {
        context.res = json(400, { error: 'Missing value' });
        return;
      }
      const entity = {
        partitionKey: 'content',
        rowKey: key,
        value: JSON.stringify(value),
        updatedAt: new Date().toISOString(),
        updatedBy: principal.userDetails || principal.userId || 'unknown'
      };
      await client.upsertEntity(entity, 'Merge');
      context.res = json(200, { ok: true, key, updatedAt: entity.updatedAt, updatedBy: entity.updatedBy });
      return;
    }

    if (req.method === 'DELETE') {
      if (!canWrite(principal)) {
        context.res = json(403, { error: 'Editor or admin role required' });
        return;
      }
      await client.deleteEntity('content', key).catch(err => {
        if (err.statusCode !== 404) throw err;
      });
      context.res = json(200, { ok: true, key });
      return;
    }

    context.res = json(405, { error: 'Method not allowed' });
  } catch (err) {
    context.log.error(err);
    context.res = json(500, { error: 'Content API failed', detail: err.message });
  }
};
