<template>
  <v-alert v-if="isError" text="Loading data did not work" title="Loading Error" type="warning" />
  <v-data-table
    v-else
    :headers="headers"
    hide-default-footer
    :items="data"
    :loading="isLoading"
    loading-text="Loading"
    :sort-by="[{ key: 'name', order: 'asc' }]"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>{{ appStore.pageHeader }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-spacer />
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ props }">
            <v-btn class="mb-2" color="primary" v-bind="props">
              New Role
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
                    <v-text-field v-model="currentEditRole.name" label="Name" />
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
              <span class="text-h5">Assign Role {{ currentEditRole.name }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="12" sm="12">
                    <v-select v-model="currentEditRights" :items="selectableRights" label="Rights" multiple />
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
      <v-icon class="me-2" size="small" @click="editRole(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="me-2" size="small" @click="deleteRole(item)">
        mdi-delete
      </v-icon>
      <v-icon size="small" @click="assignRole(item)">
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
import { EditRole, Right, Role } from '../types/types';

const appStore = useAppStore();

appStore.pageHeader = 'Roles';

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const { isLoading, isError, data } = useQuery<Role[]>({
  queryKey: ['roles'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('roles');
    return data;
  },
  initialData: [],
});

const { data: rights } = useQuery<Right[]>({
  queryKey: ['rights'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('rights');
    return data;
  },
  initialData: [],
});

const selectableRights = computed(() => {
  return rights.value.map((right) => ({
    title: right.name,
    value: right.id,
  }));
});

const createMutation = useMutation({
  mutationFn: (role: Omit<EditRole, 'id'>) => axiosInstance.post('roles', role),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  },
});

const updateMutation = useMutation({
  mutationFn: (role: EditRole) => axiosInstance.put(`roles/${role.id}`, role),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  },
});

const removeMutation = useMutation({
  mutationFn: (role: EditRole) => axiosInstance.delete(`roles/${role.id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['role'] });
  },
});

const assignMutation = useMutation({
  mutationFn: ({ roleId, rightIds }: { roleId: number, rightIds: number[] }) => {
    return axiosInstance.put(`roles/${roleId}/right`, { rightIds });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  },
});

const dialog = ref(false);
const dialogDelete = ref(false);
const dialogAssign = ref(false);
const currentEditRole = ref<EditRole>({ id: -1, name: '' });
const currentEditRights = ref<number[]>([]);

const formIsEditMode = ref(false);
const formTitle = computed(() => {
  return formIsEditMode.value ? 'Edit Role' : 'New Role';
});

const getDefaultItem = () => ({
  id: -1,
  name: '',
  rights: [],
});

const setCurrentEditRole = (role: Role) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rights, ...roleProps } = role;
  currentEditRole.value = Object.assign({}, roleProps);
};

const editRole = (role: Role) => {
  formIsEditMode.value = true;
  setCurrentEditRole(role);
  dialog.value = true;
};

const deleteRole = (role: Role) => {
  setCurrentEditRole(role);
  dialogDelete.value = true;
};

const assignRole = (role: Role) => {
  currentEditRights.value = role.rights.map(({ right: { id } }) => id);
  setCurrentEditRole(role);
  dialogAssign.value = true;
};

const closeAssign = () => {
  dialogAssign.value = false;
  currentEditRole.value = getDefaultItem();
  currentEditRights.value = [];
};

const saveAssign = () => {
  assignMutation.mutate({ roleId: currentEditRole.value.id, rightIds: currentEditRights.value });
  closeAssign();
};

const deleteItemConfirm = async () => {
  await removeMutation.mutate(currentEditRole.value);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  currentEditRole.value = getDefaultItem();
  formIsEditMode.value = false;
};

const closeDelete = () => {
  dialogDelete.value = false;
  currentEditRole.value = getDefaultItem();
};

const save = () => {
  if (formIsEditMode.value) {
    updateMutation.mutate(currentEditRole.value);
  } else {
    createMutation.mutate(currentEditRole.value);
  }
  close();
};

const reload = () => {
  queryClient.invalidateQueries({ queryKey: ['roles'] });
};
</script>
