<template>
    <BasicLayout> 
        <div class="login">
            <h2>Iniciar sesión</h2>
            <form class="ui form" @submit.prevent="login">
                <div class="field">
                    <input type="text" placeholder="Nombre de usuario" v-model="formData.identifier" :class="{error: formError.identifier}">
                </div>
                <div class="field">
                    <input type="password" placeholder="Contraseña" v-model="formData.password" :class="{error: formError.password}">
                </div>
                <p v-if="messageError" class="messageError">{{messageError}}</p>
                <button type="submit" class="ui button fluid primary" :class="{loading}">Entrar</button>
            </form>
            <router-link to="/register">Crear una cuenta</router-link>
        </div>
    </BasicLayout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as Yup from 'yup';

import { loginApi } from '../api/user';
import { setTokenApi, getTokenApi } from '../api/token';

import BasicLayout from '../layouts/BasicLayout.vue';

export default {
    name: "Login",
    components: {
        BasicLayout,
    },
    setup() {
        let formData = ref({});
        let formError = ref({});
        let loading = ref(false);
        let messageError = ref('');

        const router = useRouter();
        const token = getTokenApi();

        onMounted(() => {
            if(token) router.push("/");
        });

        const schemaForm = Yup.object().shape({
            //strapi usa identify en vez de username
            identifier: Yup.string().required(true),
            password: Yup.string().required(true),
        });

        const login = async () => {
            formError.value = {};
            messageError.value = "";

            try {
                await schemaForm.validate(formData.value, { abortEarly: false});
                
                try {
                    const response = await loginApi(formData.value);
                    if(!response?.jwt) throw "El usuario o contraseña no son válidos.";
                    setTokenApi(response.jwt);
                    router.push("/");
                    //console.log("Ok");
                } catch (error) {
                    //console.log(error);
                    messageError.value = error;
                }
                
            } catch (error) {
                error.inner.forEach((err) => {
                    formError.value[err.path] = err.message;
                })
            }
        }

        return {
            formData,
            formError,
            loading,
            login,
            messageError,
        }
    },

}
</script>

<style lang="scss" scoped>
.login {
  text-align: center;
  
  h2 {
    margin: 50px 0 30px 0;
  }

  .ui.form {
    max-width: 300px !important;
    margin: 0 auto;
    margin-bottom: 10px;

    input.error {
        border-color: #faa;
        background-color: #ffeded;
    }

    .messageError {
        border-color: #faa;
        background-color: #ffeded;
        border-radius: 5px;
    }
  }
}

</style>