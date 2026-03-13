'use strict';

/**
 * Polling trigger that fires when a Harvest project's is_active field changes.
 *
 * Dedup strategy: composite ID `{project.id}-{is_active}`.
 * When is_active flips, the composite ID changes, so Zapier treats it as new.
 */

const BASE_URL = 'https://api.harvestapp.com/v2/projects';
const PER_PAGE = 2000; // Harvest max

const fetchAllProjects = async (z) => {
  let allProjects = [];
  let nextPage = `${BASE_URL}?per_page=${PER_PAGE}`;

  while (nextPage) {
    const response = await z.request({ url: nextPage });
    const data = response.data;
    allProjects = allProjects.concat(data.projects);
    nextPage = data.links && data.links.next ? data.links.next : null;
  }

  return allProjects;
};

const perform = async (z, bundle) => {
  const projects = await fetchAllProjects(z);

  return projects
    .map((project) => ({
      id: `${project.id}-${project.is_active}`,
      project_id: project.id,
      name: project.name,
      code: project.code,
      is_active: project.is_active,
      is_billable: project.is_billable,
      is_fixed_fee: project.is_fixed_fee,
      bill_by: project.bill_by,
      budget_by: project.budget_by,
      budget: project.budget,
      hourly_rate: project.hourly_rate,
      notes: project.notes,
      starts_on: project.starts_on,
      ends_on: project.ends_on,
      client_id: project.client ? project.client.id : null,
      client_name: project.client ? project.client.name : null,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }))
    .sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
};

module.exports = {
  key: 'project_active_status_changed',
  noun: 'Project',
  display: {
    label: 'Project Active Status Changed',
    description:
      'Triggers when a project is activated or deactivated in Harvest (is_active field changes).',
  },
  operation: {
    perform,
    sample: {
      id: '12345-true',
      project_id: 12345,
      name: 'Example Project',
      code: 'EP-001',
      is_active: true,
      is_billable: true,
      is_fixed_fee: false,
      bill_by: 'Tasks',
      budget_by: 'project',
      budget: 100.0,
      hourly_rate: 150.0,
      notes: '',
      starts_on: '2026-01-01',
      ends_on: '2026-12-31',
      client_id: 6789,
      client_name: 'Acme Corp',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-03-13T12:00:00Z',
    },
    outputFields: [
      { key: 'id', label: 'Dedup ID', type: 'string' },
      { key: 'project_id', label: 'Project ID', type: 'integer' },
      { key: 'name', label: 'Project Name', type: 'string' },
      { key: 'code', label: 'Project Code', type: 'string' },
      { key: 'is_active', label: 'Is Active', type: 'boolean' },
      { key: 'is_billable', label: 'Is Billable', type: 'boolean' },
      { key: 'is_fixed_fee', label: 'Is Fixed Fee', type: 'boolean' },
      { key: 'bill_by', label: 'Bill By', type: 'string' },
      { key: 'budget_by', label: 'Budget By', type: 'string' },
      { key: 'budget', label: 'Budget', type: 'number' },
      { key: 'hourly_rate', label: 'Hourly Rate', type: 'number' },
      { key: 'notes', label: 'Notes', type: 'string' },
      { key: 'starts_on', label: 'Starts On', type: 'string' },
      { key: 'ends_on', label: 'Ends On', type: 'string' },
      { key: 'client_id', label: 'Client ID', type: 'integer' },
      { key: 'client_name', label: 'Client Name', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' },
    ],
  },
};
