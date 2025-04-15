<script setup>
import { ref, onMounted, computed, watch } from 'vue'

// API'den tüm karakterleri çekecek state ve fonksiyon
const characters = ref([])
const loading = ref(true)
const statusFilter = ref('All')
const currentPage = ref(1)

// Favoriler için gerekli state'ler
const favoriteCharacters = ref([])
const isDropdownOpen = ref(false)

import Modal from '/components/Modal.vue'

const showModal = ref(false)
const selectedCharacter = ref(null)

// Favori sayısını hesaplama
const favoriteCount = computed(() => {
    return favoriteCharacters.value.length
})

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

// Karakter butonuna tıklandığında çalışacak fonksiyon
const openModal = (character) => {
    // Seçilen karakteri state'e kaydet
    selectedCharacter.value = character
    // Modalı göster
    showModal.value = true
}

// Favori işlemleri
const isFavorite = (characterId) => {
    return favoriteCharacters.value.some((char) => char.id === characterId)
}

const toggleFavorite = (character, event) => {
    // Event yayılmasını durdur (böylece modal açılmaz)
    event.stopPropagation()

    if (isFavorite(character.id)) {
        // Karakter zaten favorilerde, çıkaralım
        favoriteCharacters.value = favoriteCharacters.value.filter(
            (char) => char.id !== character.id
        )
    } else {
        // Karakter favorilerde değil, ekleyelim
        favoriteCharacters.value.push(character)
    }
}

// Dropdown toggle
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

// Favorilerin localStorage'a kaydedilmesi
watch(
    favoriteCharacters,
    (newVal) => {
        localStorage.setItem('rickAndMortyFavorites', JSON.stringify(newVal))
    },
    { deep: true }
)

// Sayfa yüklendiğinde favorileri yükle
const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('rickAndMortyFavorites')
    if (savedFavorites) {
        favoriteCharacters.value = JSON.parse(savedFavorites)
    }
}

onMounted(() => {
    fetchCharacters()
    loadFavorites()
})
</script>
<template>
    <div class="character-container">
        <!-- Favoriler Dropdown -->
        <div class="favorites-dropdown">
            <button @click="toggleDropdown" class="favorites-btn">
                Favoriler
                <span v-if="favoriteCount > 0" class="badge">{{
                    favoriteCount
                }}</span>
            </button>

            <!-- dropdown icerigi burasi -->
            <div v-if="isDropdownOpen" class="dropdown-content">
                <template v-if="favoriteCharacters.length > 0">
                    <div
                        v-for="char in favoriteCharacters"
                        :key="char.id"
                        class="favorite-item"
                    >
                        <img
                            :src="char.image"
                            :alt="char.name"
                            class="small-avatar"
                        />
                        <span>{{ char.name }}</span>
                        <button
                            @click="toggleFavorite(char, $event)"
                            class="remove-btn position-relative"
                        >
                            <Icon name="icon-park-outline:like" />
                        </button>
                    </div>
                </template>
                <div v-else class="empty-favorites">
                    Henüz favori karakter eklemediniz.
                </div>
            </div>
        </div>

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

        <div v-if="loading" class="loading">Yükleniyor...</div>
        <div v-else class="character-grid">
            <div
                v-for="character in filteredCharacters"
                :key="character.id"
                class="character-card"
            >
                <!-- Favori butonu -->
                <button
                    @click="toggleFavorite(character, $event)"
                    class="favorite-btn"
                >
                    <Icon
                        v-if="isFavorite(character.id)"
                        name="icon-park-outline:like"
                        style="font-size: 2rem; color: red"
                    />
                    <Icon
                        v-else="isFavorite(character.id)"
                        name="icon-park-outline:like"
                        style="font-size: 2rem; color: gray"
                    />
                </button>

                <img
                    :src="character.image"
                    :alt="character.name"
                    class="character-image"
                />
                <div class="character-details">
                    <h3>{{ character.name }}</h3>
                    <p>Status: {{ character.status }}</p>
                    <p>Species: {{ character.species }}</p>
                    <!-- Butona tıklandığında karakter bilgisini geçerek openModal çağrılır -->
                    <button @click="openModal(character)">Modal Aç</button>

                    <!-- Eğer showModal true ise modalı göster ve character prop'unu geçir -->
                    <Modal
                        v-if="showModal"
                        @close="showModal = false"
                        :character="selectedCharacter"
                    />
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
<style>
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
        position: relative; /* Favori butonu için */
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

    /* Favori butonu stilleri */
    .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        color: red;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        z-index: 10;
    }

    .favorites-dropdown {
        position: relative;
        display: inline-block;
        margin-bottom: 20px;

        .favorites-btn {
            background-color: #ff5722;
            display: flex;
            align-items: center;
        }

        .badge {
            background-color: white;
            color: #ff5722;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
            margin-left: 5px;
        }

        .dropdown-content {
            position: absolute;
            right: 0;
            background-color: white;
            min-width: 250px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 20;
            border-radius: 4px;
            max-height: 400px;
            overflow-y: auto;
        }

        .favorite-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;

            .small-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }

            span {
                flex-grow: 1;
                text-align: left;
            }

            .remove-btn {
                background-color: #f44336;
                padding: 5px 10px;
                font-size: 12px;
            }
        }

        .empty-favorites {
            padding: 20px;
            text-align: center;
            color: #666;
        }
    }
}
</style>
