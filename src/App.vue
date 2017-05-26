<template>
  <v-app id="app">
    <v-toolbar class="grey darken-3">
      <v-toolbar-title>
        <div>
          <router-link :to="{ name: 'landing'}" class="title"><img src="static/galvanize-logo.svg" alt="Galvanize">Admissions Portfolio</router-link>
        </div>
      </v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid class="main-content">
        <router-view></router-view>
      </v-container>
    </main>
    <v-footer class="footer grey darken-3">
      <small>© 2017 Galvanize, Inc. All Rights Reserved.</small>
      <v-btn class="orange darken-1" v-if="!token" :router="true" :to="{ name: 'login' }">Admissions Login</v-btn></a>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      token: localStorage.token,
    };
  },
};
</script>

<style>
  #app {
    display: flex;
    flex-direction: column;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5em;
  }

  .title, .title:hover {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  .title img {
    margin-right: 0.5em;
  }

  .login-button {
    margin: 1em;
  }

  .main-content {
    display: flex;
    justify-content: center;
    width: 80%;
  }
</style>
