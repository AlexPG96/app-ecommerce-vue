<template>
    <div class="ui secondary menu">
        <div class="ui container">
            <div class="left menu">
                <router-link class="item" to="/">
                <img class="ui small image" src="../assets/logo.png" alt="ecommerce">
                <template v-for="category in categories" :key="category.id">
                    <router-link class="item" :to="category.slug">{{category.title}}</router-link>
                </template>
                </router-link>
            </div>

            <div class="right menu">
                <router-link class="item" to="/login" v-if="!token">Iniciar sesión</router-link>
                <template v-if="token">
                    <router-link class="item" to="/orders">Pedidos</router-link>
                    <span class="ui item cart" @click="openCart"><i class="shopping cart icon"></i></span>
                    <span class="ui item logout" @click="logOut"><i class="sign-out icon"></i></span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from "vuex";
import { getTokenApi, deleteTokenApi } from '../api/token';
import { getCategoriesApi } from '../api/category.js';


export default {
    name: "Menu",
    setup() {
        let categories = ref(null);

        const store = useStore();
        const token = getTokenApi();

        onMounted( async () => {
            const response =  await getCategoriesApi();
            categories.value = response;
            // console.log(response);
        })

        const logOut = () => {
            //console.log("cerrar sesión");
            deleteTokenApi();
            location.replace('/');
        };

        const openCart = () => {
            store.commit("setShowCart", true);
        };

        return {
            token,
            logOut,
            categories,
            openCart,
        }
    },
}
</script>

<style lang="scss" scoped>
.ui.menu.secondary {
    background-color: #16202B;

    .item {
        color: #fff;
        &:hover {
            color: #1fa1f1;
        }
    }

    .menu.left {
        width: 50%;

        .ui.image {
            width: 40px;
        }

    }

    .menu.right {
        width: 50%;
        justify-content: flex-end;

        .logout, .cart {
            &:hover {
                cursor: pointer;
            }
        }
    }
}

</style>