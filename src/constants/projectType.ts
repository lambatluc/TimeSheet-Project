export const projectTypeDisplayMap: Record<number, string> = {
  0: 'T&M',
  1: 'FF',
  2: 'NB',
  3: 'ODC',
  4: 'Product',
  5: 'Training',
  6: 'No Salary'
};
export const userTeam: Record<number, string> = {
  0: 'Staff',
  1: 'Internship',
  2: 'Collaborator'
};
export enum pageTitle{
  editTitle = 'Edit Project',
  createTitle = 'Create Project',
  managerTitle = 'Manager Project',
  selectData = 'Select Date',
  viewTitle = 'View Project'
}
export enum selectProjectItem{
  edit = 'Edit',
  view = 'View',
  delete = 'Delete',
  cancel = 'Cancel',
  continute = 'Continue'

}
export enum ButtonName {
  saveButton = 'Save',
  backHomeButton = 'Go Back Homepage',
  homeButton = 'HOME',
  contactButton = 'Contact Us',
  newClientButton = 'New Client',
  addUserButton = 'Add User',
  submitButton = 'Submit',
  loginButton = 'Login',
  newProject = '+ New Project',
  logOut = 'Log out'
}
export type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';
export const validDateRanges: DateRange[] = ['week', 'month', 'quarter', 'year', 'all', 'custom'];
export enum ActionType {
  DELETE = 'delete',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
export enum ActionMessageTitle {
  delete = 'Are you delete sure?',
  active = 'Are you sure you want to activate?',
  inactive = 'Are you sure you want to deactivate?'
}
export enum ActionMessageDes {
  delete = 'This item will be deleted immediately. You cannot undo this action',
  active = 'Change project status to active.',
  inactive = 'Change project status to deactive.'
}
