<template>
  <div class="library">
    <div class="main">
      <div class="header">
        <div class="title" @click="goBack">‹ {{ i18n['library-title'] }}</div>
        <div class="side-buttons">
          <button class="btn-primary">
            {{ i18n['library-new'] }}
          </button>
          <button class="btn-secondary">
            {{ i18n['library-new-folder'] }}
          </button>
          <button class="btn-secondary" @click="batchItems">
            {{ i18n['library-batch'] }}
          </button>
        </div>
      </div>
      <div class="content">
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.library {
  display: flex;
  justify-content: center;
  min-height: 100%;
}

.main {
  max-width: 42em;
  width: 100%;
  margin: 48px auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;

  .title {
    font-size: 22px;
    font-weight: bold;
    color: var(--color-bold);
    cursor: pointer;
  }

  .side-buttons {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 3px 6px;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 10px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s ease;

    .item-body {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;

      .item-title {
        color: var(--color-bold);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-meta {
        font-size: 0.8rem;
        opacity: 0.55;
      }

      .item-lock {
        width: 0.7rem;
        height: 0.85rem;
        flex-shrink: 0;
        border: 1.5px solid currentColor;
        border-radius: 3px 3px 2px 2px;
        opacity: 0.4;
        position: relative;
      }

      .item-lock::before {
        content: '';
        position: absolute;
        left: 50%;
        top: -0.35rem;
        width: 0.38rem;
        height: 0.35rem;
        border: 1.5px solid currentColor;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        transform: translateX(-50%);
      }
    }
  }

  .item:hover {
    background: var(--color-hover);
  }

  .item.folder .item-title::before {
    content: '';
    display: inline-block;
    width: 0.7rem;
    height: 0.5rem;
    margin-right: 0.45rem;
    border: 1.5px solid currentColor;
    border-radius: 1px 2px 1px 1px;
    opacity: 0.45;
    vertical-align: 0.1em;
  }
}

.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  opacity: 0.5;

  .placeholder-title {
    font-size: 1rem;
  }
}
</style>

<script setup>
import i18n from '@/i18n'
import { changePage } from '@/router'


</script>
