<template>
  <div class="landing">
    <h2>Login</h2>
    <p v-if="!error">Logging in...</p>
    <center v-if="!error">
      <v-progress-circular
      indeterminate
      v-bind:size="100"
      v-bind:width="2"
      class="orange--text"
      />
    </center>
    <v-alert error v-bind:value="error">
      {{error}}
    </v-alert>
  </div>
</template>

<script>
import Auth from '../lib/Auth';

export default {
  name: 'login',
  data() {
    return {
      error: '',
    };
  },
  mounted() {
    if (!this.$route.params.token) {
      if (window.location.hostname === 'localhost') {
        window.location = 'http://localhost:3000/auth/google';
      } else {
        window.location = 'https://galvanize-admissions-portfolio-api.galvanize.network/auth/google';
      }
    } else if (this.$route.params.token === 'error') {
      this.error = this.$route.query.error;
    } else {
      const token = this.$route.params.token;

      Auth
        .exchange(token)
        .then((result) => {
          localStorage.token = result.token;
          this.$router.push('/admin');
        }).catch(() => {
          this.error = 'Invalid Login';
        });
    }
  },
};
</script>

<style>
  .landing {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
