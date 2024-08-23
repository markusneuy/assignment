export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: any[];
};

export type EditUser = Omit<User, 'roles'>

export type Role = {
  id: number;
  name: string;
  rights: any[];
};

export type EditRole = Omit<Role, 'rights'>

export type Right = {
  id: number;
  name: string;
};
