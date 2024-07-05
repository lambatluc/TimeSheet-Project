import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, UserRoundPlus, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import avatar from '@/assets/image/avataruser.png';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ButtonName, userTeam } from '@/constants/projectType';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IBranch, IUser, IUserSelection } from '@/types';
import { useOutletContext } from 'react-router-dom';
import { List, AutoSizer, ListRowProps } from 'react-virtualized';
import { LABEL_TEAM } from '@/constants';

const Team = (): JSX.Element => {
  const { users, branches, usersData, setUsersData } = useOutletContext<{
    usersData: IUserSelection[]
    setUsersData: React.Dispatch<React.SetStateAction<IUserSelection[]>>
    users: IUser[]
    loadingUsers: boolean
    branches: IBranch[]
  }>();
  const [searchUser, setSearchUser] = useState('');
  const [searchSelectUser, setSearchSelectUser] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [showDeactive, setShowDeactive] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (users !== null) {
      setSelectedUsers(
        usersData
          .map((formUser) => {
            const user = users.find((u) => u.id === formUser.userId);
            return user !== undefined ? { ...user, type: user.type } : null;
          })
          .filter((user) => user !== null) as IUser[]
      );
    }
  }, [users, usersData]);

  const handleBranchChange = (value: string): void => {
    setSelectedBranch(value);
  };

  const handleTypeChange = (value: string): void => {
    setSelectedType(value);
  };

  const getUserTeamBgColor = (type: number | null | undefined): string => {
    if (type === 0) return 'bg-orange-500';
    if (type === null || type === undefined) return '';
    if (type === 1) return 'bg-[#4caf50]';
    if (type === 2) return 'bg-[#2e95ea]';
    return 'bg-gray-500';
  };

  const getUserTeam = (type: number | null | undefined): string => {
    if (type === undefined || type === null) return '';
    return type in userTeam ? userTeam[type] : '';
  };

  const handleUserSelect = (user: IUser): void => {
    const isUserSelected = selectedUsers.some(selectedUser => selectedUser.id === user.id);
    if (!isUserSelected) {
      const userType = usersData.length === 0 ? 1 : 0;
      const updatedUsersData = [
        ...usersData,
        { userId: user.id, type: userType, isTemp: false }
      ];
      setUsersData(updatedUsersData);
    }
  };

  const handleUserDeselect = (user: IUser): void => {
    const updatedUsersData = usersData.filter((formUser) => formUser.userId !== user.id);
    setUsersData(updatedUsersData);
    setSelectedUsers(
      selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      !selectedUsers.some((selectedUser) => selectedUser.id === user.id) &&
      (selectedBranch === 'All' || user.branchDisplayName === selectedBranch) &&
      (selectedType === 'all' || user.type === parseInt(selectedType)) &&
      (user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.emailAddress.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const filteredSelectUsers = selectedUsers.filter((user) => {
    const isActive = !user.isActive;
    const userFormData = usersData.find((formUser) => formUser.userId === user.id);
    const isDeactive = userFormData !== undefined ? userFormData.type === 3 : false;
    return (
      (user.name.toLowerCase().includes(searchSelectUser.toLowerCase()) ||
        user.emailAddress.toLowerCase().includes(searchSelectUser.toLowerCase())) &&
      ((showDeactive && showInactive && isDeactive && isActive) ||
        (showDeactive && !showInactive && isDeactive) ||
        (!showDeactive && showInactive && isActive) ||
        (!showDeactive && !showInactive))
    );
  });

  const handleDeactiveChange = (value: string, userId: number): void => {
    const updatedFormDataUsers = usersData.map((formUser) => {
      if (formUser.userId === userId) {
        return { ...formUser, type: Number(value) };
      }
      return formUser;
    });
    setUsersData(updatedFormDataUsers);
  };

  const handleTemp = (value: string, userId: number): void => {
    const updatedFormDataUsers = usersData.map((formUser) => {
      if (formUser.userId === userId) {
        return { ...formUser, isTemp: value === 'true' };
      }
      return formUser;
    });
    setUsersData(updatedFormDataUsers);
  };

  const handleShowDeactiveChange = (isChecked: boolean): void => {
    setShowDeactive(isChecked);
  };

  const handleShowInactiveChange = (isChecked: boolean): void => {
    setShowInactive(isChecked);
  };

  const renderUserRow = ({ index, key, style }: ListRowProps): JSX.Element => {
    const user = filteredUsers[index];
    return (
      <div
        key={key}
        style={style}
        className='flex justify-center items-center w-full cursor-pointer space-x-7 mt-5 p-3 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-200 bg-gray-100'
        onClick={() => {
          handleUserSelect(user);
        }}
      >
        <div className="w-7">
          <UserRoundPlus />
        </div>
        <div className="w-14">
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={user.avatarFullPath}
              alt={user.name}
            />
            <AvatarFallback>
              <img
                src={avatar}
                alt="avatarnull"
                className="w-12"
              />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="w-46">
          <div className="flex w-full">
            <div className="pr-3 w-40 truncate">
              {user.name}
            </div>
            <div
              className="p-1 w-9 text-center mr-2 h-6 text-white text-xs rounded-md"
              style={{ backgroundColor: user.branchColor }}
            >
              {user.branchDisplayName}
            </div>
            <div
              className={`p-1 w-20 h-6 text-center text-white text-xs rounded-md ${getUserTeamBgColor(
                user.type
              )}`}
            >
              {getUserTeam(user.type)}
            </div>
          </div>
          <div className="w-full truncate">
            {user.emailAddress}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-[60vh]">
      <div>
        <div className="text-xl font-bold p-3">{LABEL_TEAM.LABEL_1}</div>
        <div className="flex justify-center items-center w-full">
          <div className="w-[20vw]">
            <Checkbox
              checked={showDeactive}
              onCheckedChange={handleShowDeactiveChange}
            />
            <Label className="pl-3">{LABEL_TEAM.LABEL_2}</Label>
          </div>
          <div className="w-[20vw]">
            <Checkbox
              checked={showInactive}
              onCheckedChange={handleShowInactiveChange}
            />
            <Label className="pl-3">{LABEL_TEAM.LABEL_3}</Label>
          </div>
          <div className="relative flex items-center w-[20vw]">
            <Search className="absolute left-3 text-gray-500" />
            <Input
              placeholder="Search by name or email"
              className="pl-10 w-full"
              onChange={(e) => setSearchSelectUser(e.target.value)}
              value={searchSelectUser}
            />
          </div>
          <div className="pl-10">
            <Dialog>
              <DialogTrigger asChild>
                <Button>{ButtonName.addUserButton}</Button>
              </DialogTrigger>
              <DialogContent className="xl:w-[35vw] w-1/2 h-[95vh] min-h[90vh]">
                <DialogHeader className="h-[13vh]">
                  <DialogTitle className="text-center">
                    {LABEL_TEAM.DIALOG_TITLE}
                  </DialogTitle>
                  <div>
                    <div className="pt-2">
                      <div className="relative flex items-center">
                        <Search className="absolute left-3 text-gray-500" />
                        <Input
                          placeholder="Search by name or email"
                          className="pl-10 w-full"
                          onChange={(e) => setSearchUser(e.target.value)}
                          value={searchUser}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="pt-3 pr-8">
                        <Label>{LABEL_TEAM.DIALOG_LABEL_1}</Label>
                        <Select
                          defaultValue="All"
                          onValueChange={handleBranchChange}
                        >
                          <SelectTrigger className="w-[14vw] mt-2">
                            <SelectValue defaultValue="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.name}>
                                  {branch.displayName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-3">
                        <Label>{LABEL_TEAM.DIALOG_LABEL_2}</Label>
                        <Select
                          defaultValue="all"
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger className="w-[14vw] mt-2">
                            <SelectValue defaultValue="all" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="all">{LABEL_TEAM.SELECT_ALL}</SelectItem>
                              <SelectItem value="0">{LABEL_TEAM.SELECT_STAFF}</SelectItem>
                              <SelectItem value="1">{LABEL_TEAM.SELECT_INTERN}</SelectItem>
                              <SelectItem value="2">{LABEL_TEAM.SELECT_COL}</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                <div className="h-[65vh] w-100 mt-16">
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        width={width}
                        height={height}
                        rowCount={filteredUsers.length}
                        rowHeight={90}
                        rowRenderer={renderUserRow}
                      />
                    )}
                  </AutoSizer>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {filteredSelectUsers.map((user, index) => {
          const userFormData = usersData.find((formUser) => formUser.userId === user.id);
          const userType = userFormData !== undefined ? userFormData.type.toString() : '0';
          const isTempValue = userFormData?.isTemp ?? false;
          return (
            <div
              key={index}
              className="w-full h-16 flex justify-between items-center p-2 mt-5 bg-gray-100 dark:bg-gray-900 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <div
                className="w-16 cursor-pointer"
                onClick={() => handleUserDeselect(user)}
              >
                <X />
              </div>
              <div className="w-16">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={user.avatarFullPath} alt={user.name} />
                  <AvatarFallback>
                    <img
                      src={avatar}
                      alt="avatarnull"
                      className="w-12"
                    />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="w-72">
                <div className="flex w-full">
                  <div className="pr-3 w-60 truncate">{user.name}</div>
                  <div
                    className="p-1 w-14 text-center mr-2 h-6 text-white text-xs rounded-md"
                    style={{ backgroundColor: user.branchColor }}
                  >
                    {user.branchDisplayName}
                  </div>
                  <div
                    className={`p-1 w-32 h-6 text-center text-white text-xs rounded-md ${getUserTeamBgColor(
                      user.type
                    )}`}
                  >
                    {getUserTeam(user.type)}
                  </div>
                </div>
                <div className="w-full truncate">{user.emailAddress}</div>
              </div>
              <div className="w-32">
                <Select
                  value={userType}
                  onValueChange={(value) => handleDeactiveChange(value, user.id)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{LABEL_TEAM.SELECT_MEMBER}</SelectItem>
                    <SelectItem value="1">{LABEL_TEAM.SELECT_PM}</SelectItem>
                    <SelectItem value="2">{LABEL_TEAM.SELECT_SHADOW}</SelectItem>
                    <SelectItem value="3">{LABEL_TEAM.SELECT_DEC}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select
                  defaultValue='0'
                  value={isTempValue ? 'true' : 'false'}
                  onValueChange={(value) => handleTemp(value, user.id)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">{LABEL_TEAM.SELECT_OFF}</SelectItem>
                    <SelectItem value="true">{LABEL_TEAM.SELECT_TEMP}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="w-16 cursor-pointer"
                onClick={() => handleUserDeselect(user)}
              >
                <ChevronRight />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
