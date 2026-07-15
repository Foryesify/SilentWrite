<template>
  <header class="titlebar" :class="{ 'controls-left': controlsLeft }">
    <div class="titlebar-controls">
      <button type="button" class="window-control" @click="minimize">
        <svg viewBox="0 0 10 10"><path d="M1 5h8" /></svg>
      </button>
      <button type="button" class="window-control" @click="toggle">
        <svg viewBox="0 0 10 10">
          <path d="M2.5 3.5h5v5h-5z" />
          <path d="M3.5 1.5h5v5" />
        </svg>
      </button>
      <button type="button" class="window-control" @click="close">
        <svg viewBox="0 0 10 10"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" /></svg>
      </button>
    </div>

    <div class="titlebar-start">
      <div class="titlebar-app">SilentWrite</div>
      <div class="titlebar-menu">
        <span clas="titlebar-menu-items"></span>
      </div>
    </div>

    <div class="titlebar-center">
      <div class="titlebar-title">
        <!-- title -->
      </div>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  --titlebar-height: 32px;
  --titlebar-controls-width: 138px;
  display: grid;
  grid-template-columns: var(--titlebar-controls-width) auto 1fr;
  grid-template-areas: 'controls start center';
  align-items: center;
  height: var(--titlebar-height);
  padding: 0;
  box-sizing: border-box;
  background: var(--color-background);
  user-select: none;
}

/* default: Windows — controls on the right */
.titlebar:not(.controls-left) {
  grid-template-columns: var(--titlebar-controls-width) auto 1fr var(
      --titlebar-controls-width
    );
  grid-template-areas: 'gutter start center controls';
}

.titlebar-controls {
  grid-area: controls;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  height: 100%;
  -webkit-app-region: no-drag;
}

.titlebar.controls-left .titlebar-controls {
  justify-content: flex-start;
}

.titlebar-start {
  grid-area: start;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 100%;
  padding-left: 8px;
  -webkit-app-region: no-drag;
}

.titlebar-app,
.titlebar-menu,
.titlebar-title {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
}

.titlebar-center {
  grid-area: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  pointer-events: none;
}

.titlebar-title {
  justify-content: center;
  pointer-events: auto;
  -webkit-app-region: no-drag;
}

.window-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-heading);
  cursor: default;
}


.window-control svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.window-control:hover {
  background: var(--color-background-mute);
}

.window-control:last-child:hover {
  background: #c00;
}

.window-control:active {
  background: var(--color-border);
}

.window-control--close:hover {
  background: #e81123;
  color: #fff;
}

.window-control--close:active {
  background: #f1707a;
  color: #fff;
}
</style>

<script setup>
function minimize() {}
function toggle() {}
function close() {}
</script>
