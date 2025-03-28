<script setup>
import { ref, onMounted, computed } from 'vue'

// API'den tüm karakterleri çekecek state ve fonksiyon
const characters = ref([])
const loading = ref(true)
const statusFilter = ref('All')
const currentPage = ref(1)

// Filtre seçenekleri
const statusOptions = ['All', 'Alive', 'Dead', 'unknown']

// Tüm karakterleri çekme fonksiyonu
const fetchCharacters = async () => {
    loading.value = true
    try {
        const response = await fetch(
            `https://rickandmortyapi.com/api/character?page=${currentPage.value}`
        )
        const data = await response.json()
        characters.value = data.results
    } catch (error) {
        console.error('Veri çekme hatası:', error)
    } finally {
        loading.value = false
    }
}

// Filtrelenmiş karakterleri hesaplama
const filteredCharacters = computed(() => {
    if (statusFilter.value === 'All') {
        return characters.value
    }
    return characters.value.filter(
        (character) => character.status === statusFilter.value
    )
})

// Sayfa değişikliği fonksiyonları
const nextPage = () => {
    currentPage.value++
    fetchCharacters()
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchCharacters()
    }
}

// Komponenet yüklendiğinde karakterleri çek
onMounted(() => {
    fetchCharacters()
})
</script>

<template>
    <div class="character-container">
        <!-- Filtre Seçimi -->
        <div class="status-filter">
            <select v-model="statusFilter">
                <option
                    v-for="status in statusOptions"
                    :key="status"
                    :value="status"
                >
                    {{ status }}
                </option>
            </select>
        </div>

        <!-- Karakter Listesi -->
        <div v-if="loading" class="loading">Yükleniyor...</div>
        <div v-else class="character-grid">
            <div
                v-for="character in filteredCharacters"
                :key="character.id"
                class="character-card"
            >
                <img
                    :src="character.image"
                    :alt="character.name"
                    class="character-image"
                />
                <div class="character-details">
                    <h3>{{ character.name }}</h3>
                    <p>Status: {{ character.status }}</p>
                    <p>Species: {{ character.species }}</p>
                </div>
            </div>
        </div>

        <!-- Sayfalama Kontrolleri -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">
                Önceki Sayfa
            </button>
            <span>Sayfa: {{ currentPage }}</span>
            <button @click="nextPage">Sonraki Sayfa</button>
        </div>
    </div>
</template>

<style scoped>
.character-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    .status-filter {
        margin-bottom: 20px;
        text-align: center;
    }
    .character-grid {
        display: grid;
        grid-template-columns: repeat(3, 3fr);
        grid-template-rows: repeat(3, 3fr);
        gap: 20px;
    }

    .character-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        text-align: center;
    }

    .character-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }

    .character-details {
        padding: 10px;
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    button {
        padding: 10px 20px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
}
</style>
