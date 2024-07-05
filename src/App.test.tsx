import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Client from './features/ProjectFormManager/General/Client/Client';
import { saveNewClient } from './api';
import { ButtonName, ERROR_MESSAGES, LABEL_GENERAL } from './constants';
jest.mock('./api', () => ({
  saveNewClient: jest.fn().mockResolvedValue({})
}));
describe('Client component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders with form inputs', () => {
    render(
      <Client openDia={true} setOpenDia={() => {}} refetchData={() => {}} />
    );
    expect(screen.getByPlaceholderText('Client Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Code')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(LABEL_GENERAL.DIALOG_LABEL_ADDRESS)
    ).toBeInTheDocument();
  });
  it('submits form with valid data', async () => {
    render(
      <Client openDia={true} setOpenDia={() => {}} refetchData={() => {}}/>
    );
    userEvent.type(screen.getByPlaceholderText('Client Name'), 'Anh Vu ne ahihi');
    userEvent.type(screen.getByPlaceholderText('Code'), 'AV2002');
    userEvent.type(
      screen.getByPlaceholderText(LABEL_GENERAL.DIALOG_LABEL_ADDRESS),
      '26 Nguyen Tao'
    );
    fireEvent.click(screen.getByText(ButtonName.saveButton));
    await waitFor(() => {
      expect(saveNewClient).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText('Client Details')).not.toBeInTheDocument();
  });
  it('shows message on invalid form submit', async () => {
    render(
      <Client openDia={true} setOpenDia={() => {}} refetchData={() => {}} />
    );
    fireEvent.click(screen.getByText(ButtonName.saveButton));
    await waitFor(() => {
      expect(
        screen.getByText(ERROR_MESSAGES.client.require_name)
      ).toBeInTheDocument();
      expect(
        screen.getByText(ERROR_MESSAGES.client.require_code)
      ).toBeInTheDocument();
    });
    expect(saveNewClient).not.toHaveBeenCalled();
  });
});
