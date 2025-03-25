<script setup>
import { ref } from 'vue'

const recipe = ref(null) // Başlangıçta boş değer veriyoruz

fetch('https://dummyjson.com/recipes')
    .then((response) => response.json())
    .then((data) => {
        recipe.value = data.recipes.find((t) => t.id === 1) // ID'si 1 olanı ata
    })
    .catch((error) => console.error('Hata oluştu:', error))
const nextRecipe = () => {}
</script>

<template>
    <div class="container">
        <p v-if="recipe">{{ recipe.name }}</p>
    </div>
</template>
