<template>
    <div class="comingsoon-container">
        <div class="comingsoon-overlay">
            <div class="comingsoon-text">
                Work in progress
            </div>
        </div>
        <div class="slot">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.comingsoon-container {
    position: relative;
    z-index: 1;
}

.slot {
    filter: brightness(0.6) grayscale(1);
}

.comingsoon-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.comingsoon-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: bold;
    color: var(--foreground-primary);
    z-index: 3;
}
</style>