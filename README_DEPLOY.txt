BW PLAYBOOK TERRITORY BUILDER — PLAYBOOK MODULE

COPY INTO YOUR PLAYBOOK REPOSITORY
1. Copy territory-builder/ into your deployed site root.
2. Merge api/ into your existing Azure Functions api folder.
3. Merge the route entries from staticwebapp.config.sample.json into your existing staticwebapp.config.json.
4. Add the link from PLAYBOOK_NAV_SNIPPET.html to your dashboard or navigation.
5. Commit and deploy through your existing Azure Static Web Apps workflow.

FINAL PAGE
/territory-builder/

API
/api/territory-analyse

Do not overwrite an existing staticwebapp.config.json or api/package.json blindly; merge the supplied entries with your existing files.
