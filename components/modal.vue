<template>
    <div class="modal-container">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">X</button>
            <!-- Slot yerine doğrudan karakter bilgilerini görüntülüyoruz -->
            <h2>{{ character.name }}</h2>
            <img
                :src="character.image"
                :alt="character.name"
                class="character-image"
                style="width: 550px; height: 350px; border-radius: 20px"
            />
            <p>Status: {{ character.status }}</p>
            <p>Species: {{ character.species }}</p>
            <p>Gender: {{ character.gender }}</p>
            <p>Location: {{ character.location.name }}</p>
            <p>Species: {{ character.species }}</p>
        </div>
    </div>
</template>

<script setup>
// defineProps ile ana bileşenden gelen karakter verisini tanımlıyoruz
const props = defineProps({
    character: {
        type: Object, // Veri tipi: Obje
        required: true, // Zorunlu olarak gelmeli
    },
})

// character özelliğine kısa erişim için değişken oluşturuyoruz
const { character } = props
</script>

<style scoped>
.modal-container {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
    background-color: transparent;
    z-index: 1000;
    .modal-content {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        min-width: 300px;
        position: relative;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        justify-content: center;
        align-items: center;
        p {
            font-size: 18px;
            font-weight: 600;
        }
    }
    .close-button {
        position: absolute;
        top: 8px;
        right: 12px;
        background: none;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        color: black;
    }
}
</style>
