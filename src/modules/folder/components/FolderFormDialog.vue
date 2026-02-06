<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Folder } from '@/types'

const props = defineProps<{
  open: boolean
  folder?: Folder | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: { name: string }]
}>()

const name = ref('')

const isEditMode = computed(() => !!props.folder)
const dialogTitle = computed(() => (isEditMode.value ? 'Edit Folder' : 'New Folder'))

// Reset form when dialog opens or folder changes
watch(
  () => [props.open, props.folder],
  () => {
    if (props.open) {
      if (props.folder) {
        name.value = props.folder.name
      } else {
        name.value = ''
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (!name.value.trim()) return
  emit('submit', { name: name.value.trim() })
}

const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[350px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="folderName">Folder Name</Label>
          <Input id="folderName" v-model="name" placeholder="Enter folder name" autofocus />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="handleOpenChange(false)"> Cancel </Button>
          <Button type="submit" :disabled="!name.trim()">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
