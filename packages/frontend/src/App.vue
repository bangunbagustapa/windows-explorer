<script setup lang="ts">
import FolderTree from "./components/FolderTree.vue";
import { UiIcon } from "./ui";
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Header -->
    <header class="bg-white border-b border-neutral-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UiIcon name="folder" class="w-8 h-8 text-accent-600" />
          <h1 class="text-xl font-semibold text-neutral-900">Windows Explorer</h1>
        </div>
        <div class="w-64">
          <slot name="search" />
        </div>
      </div>
    </header>

    <!-- Two-panel layout -->
    <div class="grid grid-cols-[320px_1fr] h-[calc(100vh-73px)]">
      <!-- Left panel: folder tree -->
      <aside class="bg-white border-r border-neutral-200 overflow-y-auto">
        <div class="p-4">
          <h2 class="text-sm font-medium text-neutral-600 mb-3">Folders</h2>
          <FolderTree />
        </div>
      </aside>

      <!-- Right panel: subfolders grid -->
      <main class="bg-neutral-50 overflow-y-auto">
        <div class="p-6">
          <slot name="content" />
        </div>
      </main>
    </div>
  </div>
</template>
