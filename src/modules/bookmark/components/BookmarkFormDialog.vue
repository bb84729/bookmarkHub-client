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
import type { Bookmark } from '@/types'

const props = defineProps<{
  open: boolean
  bookmark?: Bookmark | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: { title: string; url: string; description: string; tags: string[] }]
}>()

const title = ref('')
const url = ref('')
const description = ref('')
const tags = ref('')

const isEditMode = computed(() => !!props.bookmark)

const dialogTitle = computed(() => (isEditMode.value ? 'Edit Bookmark' : 'New Bookmark'))

// Reset form when dialog opens or bookmark changes
watch(
  () => [props.open, props.bookmark],
  () => {
    if (props.open) {
      if (props.bookmark) {
        title.value = props.bookmark.title
        url.value = props.bookmark.url
        description.value = props.bookmark.description || ''
        tags.value = props.bookmark.tags.join(', ')
      } else {
        title.value = ''
        url.value = ''
        description.value = ''
        tags.value = ''
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', {
    title: title.value,
    url: url.value,
    description: description.value,
    tags: tags.value ? tags.value.split(',').map((t) => t.trim()) : [],
  })
}

const handleOpenChange = (value: boolean) => {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Title</Label>
          <Input id="title" v-model="title" placeholder="Enter title" />
        </div>

        <div class="space-y-2">
          <Label for="url">URL</Label>
          <Input id="url" v-model="url" placeholder="https://example.com" />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Input id="description" v-model="description" placeholder="Optional description" />
        </div>

        <div class="space-y-2">
          <Label for="tags">Tags</Label>
          <Input id="tags" v-model="tags" placeholder="tag1, tag2, tag3" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="handleOpenChange(false)">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
