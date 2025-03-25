<script setup>
import { ref } from 'vue'

const recipe = ref(null) // Başlangıçta boş değer veriyoruz
const recipes = ref([])
const currentId = ref(1)

// Tüm tarifleri almak ve başlangıç tarifini ayarlamak
fetch('https://dummyjson.com/recipes')
    .then((response) => response.json())
    .then((data) => {
        recipes.value = data.recipes // Tüm tarifleri sakla
        recipe.value = recipes.value.find((t) => t.id === currentId.value) // ID'si 1 olanı ata
    })
    .catch((error) => console.error('Hata oluştu:', error))

const nextRecipe = () => {
    // Mevcut ID'yi artır
    currentId.value++

    // Eğer recipes array'i boş değilse ve mevcut ID geçerliyse
    if (recipes.value.length > 0) {
        const nextRecipe = recipes.value.find((t) => t.id === currentId.value)

        // Eğer bir sonraki tarif bulunamazsa, başa dön (opsiyonel)
        if (!nextRecipe) {
            currentId.value = 1
            recipe.value = recipes.value.find((t) => t.id === 1)
        } else {
            recipe.value = nextRecipe
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="card" v-if="recipe">
            <div class="card-content">
                <h1>{{ recipe.name }}</h1>
                <img
                    :src="recipe.image"
                    alt="recipe-picture"
                    class="card-img"
                />
                <section class="card-food-content">
                    <div class="ingredients-area">
                        <p>ingredients</p>
                        <ul>
                            <li
                                v-for="(
                                    ingredient, index
                                ) in recipe.ingredients"
                                :key="index"
                            >
                                {{ ingredient }}
                            </li>
                        </ul>
                    </div>
                    <div class="instructions-area">
                        <p>instructions</p>
                        <ul>
                            <li
                                v-for="(
                                    instructions, index
                                ) in recipe.instructions"
                                :key="index"
                            >
                                {{ instructions }}
                            </li>
                        </ul>
                    </div>
                </section>
                <button @click="nextRecipe">Sonraki Tarif</button>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .card {
        width: 700px;
        height: 900px;
        border: 1px solid black;
        border-radius: 16px;
        background-color: whitesmoke;
        .card-content {
            padding: 30px 20px;
            h1 {
                display: flex;
                justify-content: center;
                font-family: 'SF Pro Text', sans-serif;
            }
            .card-img {
                margin: auto;
                display: flex;
                justify-content: center;
                width: 400px;
            }
            .card-food-content {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                    font-family: 'SF Pro Text', sans-serif;
                    text-align: start;
                    font-size: 24px;
                    font-weight: bold;
                }
                ul {
                    list-style-type: none;
                    li {
                    }
                }
            }
        }
    }
}
</style>
