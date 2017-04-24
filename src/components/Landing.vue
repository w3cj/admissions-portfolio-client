<template>
  <div class="landing">
    <h2>Admissions Portfolio</h2>
    <v-btn class="orange darken-1" v-if="!token && !portfolio_id" :router="true" :to="{ name: 'login' }">Login</v-btn></a>
    <v-btn primary dark v-if="!token && portfolio_id" :router="true" :to="{ name: 'portfolio', params: { portfolio_id: portfolio_id }}">Go To Portfolio</v-btn>
    <v-btn primary dark v-if="token" :router="true" :to="{ name: 'admin' }" class="orange darken-1">View Applicants</v-btn>
  </div>
</template>

<script>
export default {
  name: 'landing',
  computed: {
    portfolio_id() {
      return localStorage.portfolio_id;
    },
    token() {
      return localStorage.token;
    },
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
