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
              New Right
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
                    <v-text-field v-model="currentEditRight.name" label="Name" />
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
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editRight(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="me-2" size="small" @click="deleteRight(item)">
        mdi-delete
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
import { Right } from '../types/types';

const appStore = useAppStore();

appStore.pageHeader = 'Rights';

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const { isLoading, isError, data } = useQuery<Right[]>({
  queryKey: ['rights'],
  queryFn: async () => {
    const { data } = await axiosInstance.get('rights');
    return data;
  },
  initialData: [],
});

const createMutation = useMutation({
  mutationFn: (right: Omit<Right, 'id'>) => axiosInstance.post('rights', right),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rights'] });
  },
});

const updateMutation = useMutation({
  mutationFn: (right: Right) => axiosInstance.put(`rights/${right.id}`, right),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rights'] });
  },
});

const removeMutation = useMutation({
  mutationFn: (right: Right) => axiosInstance.delete(`rights/${right.id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rights'] });
  },
});

const dialog = ref(false);
const dialogDelete = ref(false);
const currentEditRight = ref({ id: -1, name: '' });

const formIsEditMode = ref(false);
const formTitle = computed(() => {
  return formIsEditMode.value ? 'Edit Right' : 'New Right';
});

const getDefaultItem = () => ({
  id: -1,
  name: '',
});

const setcurrentEditRight = (right: Right) => {
  currentEditRight.value = Object.assign({}, right);
};

const editRight = (right: Right) => {
  formIsEditMode.value = true;
  setcurrentEditRight(right);
  dialog.value = true;
};

const deleteRight = (right: Right) => {
  setcurrentEditRight(right);
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  await removeMutation.mutate(currentEditRight.value);
  closeDelete();
};

const close = () => {
  dialog.value = false;
  currentEditRight.value = getDefaultItem();
  formIsEditMode.value = false;
};

const closeDelete = () => {
  dialogDelete.value = false;
  currentEditRight.value = getDefaultItem();
};

const save = () => {
  if (formIsEditMode.value) {
    updateMutation.mutate(currentEditRight.value);
  } else {
    createMutation.mutate(currentEditRight.value);
  }
  close();
};

const reload = () => {
  queryClient.invalidateQueries({ queryKey: ['rights'] });
};
</script>
