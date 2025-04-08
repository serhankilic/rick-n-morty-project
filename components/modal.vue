<template>
    <div class="modal-container">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">X</button>
            <slot />
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.modal-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    background-color: transparent; /* Arka planı kapatmaz */
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    min-width: 300px;
    position: relative;
}

.close-button {
    position: absolute;
    top: 8px;
    right: 12px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}
</style>
