<script setup>
import { ref, onMounted } from 'vue'

// Reactive state değişkenleri
const characters = ref([])
const currentCharacter = ref(null)
const currentCharacterId = ref(1)
const loading = ref(true)
const totalCharacters = ref(826) // API'den gelen toplam karakter sayısı

// Karakter çekme fonksiyonu
const fetchCharacter = async (id) => {
    loading.value = true // yukleniyor kismi
    try {
        const response = await fetch(
            `https://rickandmortyapi.com/api/character/${id}`
        )
        const data = await response.json()
        currentCharacter.value = data
        currentCharacterId.value = id
    } catch (error) {
        // hata alirsa
        console.error('Veri çekme hatası:', error)
    } finally {
        // yukleme durur
        loading.value = false
    }
}

// loading first character (rickkkk)
onMounted(() => {
    fetchCharacter(1)
})

// next button
const nextCharacter = () => {
    if (currentCharacterId.value < totalCharacters.value) {
        // karakterin sonuna kadar gider, sonundayken ilerlemez.
        fetchCharacter(currentCharacterId.value + 1)
    }
}

// back button
const previousCharacter = () => {
    if (currentCharacterId.value > 1) {
        // 1'e kadar geri gider, 1'de durur.
        fetchCharacter(currentCharacterId.value - 1)
    }
}
</script>

<template>
    <div class="character-container">
        <div v-if="loading" class="loading">Loading...</div>

        <div v-else-if="currentCharacter" class="character-details">
            <div class="id-number">
                <p class="id-number-text">{{ currentCharacter.id }}</p>
            </div>
            <img :src="currentCharacter.image" :alt="currentCharacter.name" />
            <div class="character-main">
                <p class="character-name">{{ currentCharacter.name }}</p>
            </div>
            <div class="character-info">
                <p>Status: {{ currentCharacter.status }}</p>
                <p>Species: {{ currentCharacter.species }}</p>
                <p>Gender: {{ currentCharacter.gender }}</p>
                <p>Origin: {{ currentCharacter.origin.name }}</p>
                <p>Location: {{ currentCharacter.location.name }}</p>
            </div>
        </div>

        <div class="navigation-buttons">
            <label for="previous-button">
                <button
                    @click="previousCharacter"
                    :disabled="currentCharacterId === 1"
                    id="previous-button"
                >
                    Önceki
                </button>
            </label>

            <label for="next-button">
                <button
                    @click="nextCharacter"
                    :disabled="currentCharacterId === totalCharacters"
                    id="next-button"
                >
                    Sonraki
                </button>
            </label>
        </div>
    </div>
</template>

<style>
.character-container {
    width: 100vw;
    height: 100vh;
    margin: 0 auto;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .id-number {
        margin: 0 auto;
        width: 45px;
        height: 45px;
        background-color: mediumspringgreen;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .id-number-text {
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 26px;
        }
    }
    .character-details img {
        max-width: 700px;
        border-radius: 10px;
        margin: 20px 0;
    }
    .character-main {
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        column-gap: 50px;
        justify-content: center;
        align-items: center;
        position: relative;
        .character-name {
            font-size: 32px;
            font-weight: bold;
            position: relative;
            text-align: center;
        }
    }

    .character-info {
        position: relative;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        width: 100%;
        height: 100%;

        p {
            font-size: 20px;
            font-weight: 500;
            font-family: 'SF Pro Display', serif;
        }
    }
    .navigation-buttons {
        width: 500px;
        margin: 20px auto 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        button {
            font-size: 20px;
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button:disabled {
            background-color: lightgray;
            cursor: not-allowed;
            color: black;
        }
    }
}
</style>
