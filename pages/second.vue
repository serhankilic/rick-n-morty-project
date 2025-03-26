<script setup>
import { ref, onMounted, computed } from 'vue'

// Reactive state değişkenleri
const characters = ref([])
const currentCharacter = ref(null)
const currentCharacterId = ref(1) // id'si 1 olanla basla
const loading = ref(true)
const totalCharacters = ref(826)
const statusFilter = ref('All') // Varsayılan filtre 'All'

// Status seçenekleri
const statusOptions = ['All', 'Alive', 'Dead', 'unknown']

// Karakter çekme fonksiyonu
const fetchCharacter = async (id) => {
    loading.value = true
    try {
        const response = await fetch(
            `https://rickandmortyapi.com/api/character/${id}`
        )
        const data = await response.json()
        currentCharacter.value = data
        currentCharacterId.value = id
    } catch (error) {
        console.error('Veri çekme hatası:', error)
    } finally {
        loading.value = false
    }
}

// Filtrelenmiş karakter kontrolü
const isCharacterVisible = computed(() => {
    if (statusFilter.value === 'All') return true
    return currentCharacter.value?.status === statusFilter.value
})

// İlk karakteri yükle
onMounted(() => {
    fetchCharacter(1)
})

// Next button
const nextCharacter = () => {
    // Bir sonraki uygun karakteri bulana kadar ilerle
    let nextId = currentCharacterId.value + 1
    while (nextId <= totalCharacters.value) {
        fetchCharacter(nextId)
        // Eğer filtre uygunsa dur
        if (isCharacterVisible.value) break
        nextId++
    }
}

// Previous button
const previousCharacter = () => {
    // Bir önceki uygun karakteri bulana kadar geri gel
    let prevId = currentCharacterId.value - 1
    while (prevId >= 1) {
        fetchCharacter(prevId)
        // Eğer filtre uygunsa dur
        if (isCharacterVisible.value) break
        prevId--
    }
}
</script>

<template>
    <div class="character-container">
        <!-- Status filtre seçenekleri -->
        <div class="status-filter">
            <select v-model="statusFilter" class="character-status-area">
                <option
                    v-for="status in statusOptions"
                    :key="status"
                    :value="status"
                    class="status-filter-boxes"
                >
                    {{ status }}
                </option>
            </select>
        </div>

        <div v-if="loading" class="loading">Loading...</div>

        <!-- Filtre kontrolü eklenmiş karakter gösterimi -->
        <div
            v-else-if="currentCharacter && isCharacterVisible"
            class="character-details"
        >
            <!-- guncel karakter VE gorunur olmasi lazim (status'u secili olan) -->
            <div class="image-area">
                <img
                    :src="currentCharacter.image"
                    :alt="currentCharacter.name"
                    class="card-img"
                />
                <div class="id-number">
                    <p class="id-number-text">{{ currentCharacter.id }}</p>
                </div>
            </div>
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
            <button
                @click="previousCharacter"
                :disabled="currentCharacterId === 1"
            >
                Önceki
            </button>
            <button
                @click="nextCharacter"
                :disabled="currentCharacterId === totalCharacters"
            >
                Sonraki
            </button>
        </div>
    </div>
</template>

<style scoped>
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
    .status-filter {
        padding-bottom: 20px;
        .character-status-area {
            width: 150px;
            height: 50px;
            border-radius: 15px;
            font-size: 18px;
            text-align: center;
        }
    }
    .image-area {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding-bottom: 20px;
        .id-number {
            position: absolute;
            top: 0;
            left: 0;
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
        .card-img {
            position: relative;
            width: 300px;
            border-radius: 15px;
        }
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
