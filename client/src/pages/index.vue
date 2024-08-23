<template>
  <v-alert v-if="isError" text="Loading data did not work" title="Loading Error" type="warning" />
  <v-data-table
    v-else
    :headers="headers"
    hide-default-footer
    :items="data"
    :loading="isLoading"
    loading-text="Loading"
    :sort-by="[{ key: 'firstName', order: 'asc' }]"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ appStore.pageHeader }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-spacer />
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ props }">
            <v-btn class="mb-2" color="primary" v-bind="props">
              New User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="currentEditItem.firstName" label="First Name" />
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="currentEditItem.lastName" label="Last Name" />
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="currentEditItem.email" label="Email" />
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="currentEditItem.phone" label="Phone" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogAssign" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Assign User {{ currentEditItem.firstName }} {{ currentEditItem.lastName }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="12" sm="12">
                    <v-select v-model="currentEditRoles" :items="selectableRoles" label="Roles" multiple />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="blue-darken-1" variant="text" @click="closeAssign">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="saveAssign">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editUser(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="me-2" size="small" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
      <v-icon size="small" @click="assignUser(item)">
        mdi-account-plus
      </v-icon>
    </template>
    <template #no-data>
      <v-btn color="primary" @click="reload">
        Reload
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAppStore } from '../stores/app';
import { useMutation, useQuery } from '@tanstack/vue-query';
import axiosInstance from '@/clients/api';
import queryClient from '../plugins/query';
import { EditUser, Role, User } from '../types/types';

const appStore = useAppStore();

appStore.pageHeader = 'Users';

const headers = [
  { title: 'First Name', key: 'firstName' },
  { title: 'Last Name', key: 'lastName' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const { isLoading, isError, data } = useQuery<User[]>({
  queryKey: ['users'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('users');
    return data;
  },
  initialData: [],
});

const { data: roles } = useQuery<Role[]>({
  queryKey: ['roles'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('roles');
    return data;
  },
  initialData: [],
});

const selectableRoles = computed(() => {
  return roles.value.map((role) => ({
    title: role.name,
    value: role.id,
  }));
});

const createMutation = useMutation({
  mutationFn: (user: Omit<EditUser, 'id'>) => axiosInstance.post('users', user),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

const updateMutation = useMutation({
  mutationFn: (user: EditUser) => axiosInstance.put(`users/${user.id}`, user),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

const removeMutation = useMutation({
  mutationFn: (user: EditUser) => axiosInstance.delete(`users/${user.id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

const assignMutation = useMutation({
  mutationFn: ({ userId, roleIds }: { userId: number, roleIds: number[] }) => {
    return axiosInstance.put(`users/${userId}/role`, { roleIds });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

const dialog = ref(false);
const dialogDelete = ref(false);
const dialogAssign = ref(false);
const currentEditItem = ref<EditUser>({ id: -1, firstName: '', lastName: '', email: '', phone: '' });
const currentEditRoles = ref<number[]>([]);

const formIsEditMode = ref(false);
const formTitle = computed(() => {
  return formIsEditMode.value ? 'Edit User' : 'New User';
});

const getDefaultItem = (): User => ({
  id: -1,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  roles: [],
});

const setCurrentEditUser = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { roles, ...userProps } = user;
  currentEditItem.value = Object.assign({}, userProps);
};

const editUser = (user: User) => {
  formIsEditMode.value = true;
  setCurrentEditUser(user);
  dialog.value = true;
};

const deleteItem = (user: User) => {
  currentEditItem.value = Object.assign({}, user);
  setCurrentEditUser(user);
  dialogDelete.value = true;
};

const assignUser = (user: User) => {
  currentEditRoles.value = user.roles.map(({ role: { id } }) => id);
  setCurrentEditUser(user);
  dialogAssign.value = true;
};

const closeAssign = () => {
  dialogAssign.value = false;
  currentEditItem.value = getDefaultItem();
  currentEditRoles.value = [];
};

const saveAssign = () => {
  assignMutation.mutate({ userId: currentEditItem.value.id, roleIds: currentEditRoles.value });
  closeAssign();
};

const deleteItemConfirm = async () => {
  await removeMutation.mutate(currentEditItem.value);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  currentEditItem.value = getDefaultItem();
  formIsEditMode.value = false;
};

const closeDelete = () => {
  dialogDelete.value = false;
  currentEditItem.value = getDefaultItem();
};

const save = () => {
  if (formIsEditMode.value) {
    updateMutation.mutate(currentEditItem.value);
  } else {
    createMutation.mutate(currentEditItem.value);
  }
  close();
};

const reload = () => {
  queryClient.invalidateQueries({ queryKey: ['users'] });
};
</script>
