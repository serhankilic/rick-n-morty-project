<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const characters = ref([])
const loading = ref(true)
const statusFilter = ref('All')
const currentPage = ref(1)
const totalPages = ref(1)

// Filtre seçenekleri
const statusOptions = ['All', 'Alive', 'Dead', 'unknown']

// Tüm karakterleri çekme fonksiyonu
const fetchCharacters = async () => {
    loading.value = true
    try {
        // Status parametresini API çağrısına ekle
        const statusParam =
            statusFilter.value === 'All'
                ? ''
                : `status=${statusFilter.value.toLowerCase()}`

        const url = statusParam
            ? `https://rickandmortyapi.com/api/character?page=${currentPage.value}&${statusParam}`
            : `https://rickandmortyapi.com/api/character?page=${currentPage.value}`

        const response = await fetch(url)
        const data = await response.json()
        characters.value = data.results
        totalPages.value = data.info.pages // Toplam sayfa sayısını al
    } catch (error) {
        console.error('Veri çekme hatası:', error)
    } finally {
        loading.value = false
    }
}

// Sayfa numaralarını hesapla
const pageNumbers = computed(() => {
    const range = 2
    let pages = []

    // 1 ve son sayfayı her zaman ekle
    pages.push(1)
    if (totalPages.value > 1) pages.push(totalPages.value)

    // Mevcut sayfanın etrafındaki sayfaları ekle
    for (
        let i = Math.max(2, currentPage.value - range);
        i <= Math.min(totalPages.value - 1, currentPage.value + range);
        i++
    ) {
        if (!pages.includes(i)) pages.push(i)
    }

    return pages.sort((a, b) => a - b)
})

// Belirli bir sayfaya gitme fonksiyonu
const goToPage = (page) => {
    currentPage.value = page
    fetchCharacters()
}

// Sayfa değişikliği fonksiyonları
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchCharacters()
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchCharacters()
    }
}

// Status veya sayfa değiştiğinde karakterleri yeniden çek
watch([statusFilter, currentPage], () => {
    fetchCharacters()
})

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
                v-for="character in characters"
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
                Önceki
            </button>

            <div class="page-numbers">
                <template v-for="(page, index) in pageNumbers" :key="page">
                    <!-- Sayfalar arasına ... koy -->
                    <span
                        v-if="index > 0 && page - pageNumbers[index - 1] > 1"
                        class="dots"
                        >...</span
                    >

                    <button
                        @click="goToPage(page)"
                        :class="{ active: page === currentPage }"
                    >
                        {{ page }}
                    </button>
                </template>
            </div>

            <button @click="nextPage" :disabled="currentPage === totalPages">
                Sonraki
            </button>
        </div>
    </div>
</template>

<style scoped>
.character-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.status-filter {
    margin-bottom: 20px;
    text-align: center;
}

.character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.page-numbers {
    display: flex;
    align-items: center;
    gap: 5px;
}

.page-numbers button {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-numbers button.active {
    background-color: #4caf50;
    color: white;
}

.page-numbers .dots {
    margin: 0 5px;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>
