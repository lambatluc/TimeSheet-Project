export const ERROR_MESSAGES = {
  general: {
    required_error: 'Please select a client.',
    name_min_length: 'Project name is required',
    code_min_length: 'Project code is required',
    time_end_after_start: 'End time must be after start time',
    general_valid: 'General Invalid! Please check the required field.'
  },
  team: {
    no_users_added: 'Team Invalid! Please add at least one user.',
    at_least_one_PM: 'Project must have a PM'
  },
  tasks: {
    no_tasks_added: 'Task Invalid! Please add at least one task.'
  },
  client: {
    require_name: 'Name is require!',
    require_code: 'Code is require!'
  },
  projectIteam: {
    delete: 'Failed to delete project',
    active: 'Failed to active project',
    inactive: 'Failed to inactive project'
  },
  customTime: {
    requireStart: 'Start Date is require',
    requireEnd: 'End Date is require'
  },
  login: {
    requireUser: 'Username is require.',
    requirePassword: 'Password is require!'
  }
};
export const TOAST_MESSAGES = {
  success: {
    create_success: 'Create Success!',
    edit_success: 'Edit Success !',
    delete_success: 'Delete Success !',
    active_success: 'Active Success !',
    inactive_success: 'Inactive Success !',
    login_success: 'Login Success !'
  },
  error: {
    data_invalid: 'Invalid data. Please check the highlighted sections.',
    client_invalid: 'Please fix the requires in the form.'
  }
};
