<template>
  <div class="landing">
    <h2>Applicants</h2>
    <v-btn v-if="!create" class="green darken-1" @click.native="create = true">Add Applicant</v-btn>
    <v-card v-if="create" class="grey lighten-4 elevation-0">
      <v-card-text>
        <v-container fluid>
          <v-row row v-if="creatingApplicant">
            <v-col xs12>
              <center>
                <v-progress-circular indeterminate class="green--text" />
              </center>
            </v-col>
          </v-row>
          <div v-if="!creatingApplicant">
            <v-row row v-if="createError">
              <v-col xs12>
                <p class="text-xs-center red--text">Error creating applicant. Try again.</p>
              </v-col>
            </v-row>
            <v-row row>
              <v-col xs12 sm4>
                <v-subheader>First Name</v-subheader>
              </v-col>
              <v-col xs12 sm8>
                <v-text-field
                  label="First Name"
                  single-line
                  prepend-icon="person"
                  v-model="applicant.first_name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row row>
              <v-col xs12 sm4>
                <v-subheader>Last Name</v-subheader>
              </v-col>
              <v-col xs12 sm8>
                <v-text-field
                  label="Last Name"
                  single-line
                  prepend-icon="person"
                  v-model="applicant.last_name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row row>
              <v-col xs12 sm4>
                <v-subheader>Email</v-subheader>
              </v-col>
              <v-col xs12 sm8>
                <v-text-field
                  label="Email"
                  single-line
                  prepend-icon="email"
                  type="email"
                  v-model="applicant.email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row row>
              <v-col xs4>
              </v-col>
              <v-col xs8>
                <v-btn class="orange darken-1" @click.native="createApplicant">Create Applicant</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
    <center v-if="loading" class="mt-4">
      <v-progress-circular indeterminate class="green--text" />
    </center>
    <div v-if="!loading" class="mt-2">
      <h6>Possible Statuses:</h6>
      <v-chip label class="red white--text">
        <v-icon left>report_problem</v-icon>Not Started
      </v-chip>
      <v-chip label class="grey white--text">
        <v-icon left>flag</v-icon>Started
      </v-chip>
      <v-chip label class="orange white--text">
        <v-icon left>save</v-icon>Saved
      </v-chip>
      <v-chip label class="green white--text">
        <v-icon left>check</v-icon>Submitted
      </v-chip>
      <v-card class="grey lighten-4 elevation-0">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col xs3>
                <v-subheader v-text="'Order By'" />
              </v-col>
              <v-col xs9>
                <v-select
                  v-bind:items="orderBys"
                  v-model="orderBy"
                  label="Order By"
                  light
                  single-line
                  auto
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col xs6>
                <v-radio label="Ascending" primary v-model="sortOrder" value="ascending" light />
              </v-col>
              <v-col xs6>
                <v-radio label="Descending" primary v-model="sortOrder" value="descending" light />
              </v-col>
            </v-row>
            <v-row row>
              <v-col xs12>
                <v-text-field
                  name="search"
                  v-model="search"
                  label="Search Applicants"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </div>
    <v-expansion-panel expand class="applicant-list mt-4 mb-4" v-if="!loading">
      <v-expansion-panel-content v-for="applicant in sortedApplicants" :key="applicant._id" v-model="applicant.view">
        <div slot="header">
          <h5>
            {{applicant.last_name}}, {{applicant.first_name}}
            <span v-for="portfolio in portfolios[applicant._id]">
              <v-chip
                v-if="portfolio.update_date"
                v-bind:class="{
                    green: progress[applicant._id] == 100,
                    orange: progress[applicant._id] != 100
                }"
                class="white--text">
                {{ progress[applicant._id] == 100 ? 'Submitted:' : 'Updated:' }} {{portfolio.update_date | moment}}
                <v-icon right>today</v-icon>
              </v-chip>
            </span>
          </h5>
          <v-progress-linear
            :value="progress[applicant._id]"
            height="15"
            :error="progress[applicant._id] < 50"
            :warning="progress[applicant._id] >= 50 && progress[applicant._id] < 90"
            :success="progress[applicant._id] >= 90"
            class="applicant-progress"></v-progress-linear>
        </div>
        <v-card>
          <v-btn @click.native="createPortfolio(applicant)" class="orange darken-1" v-if="!portfolios[applicant._id] || portfolios[applicant._id].length == 0">Create Portfolio</v-btn>
          <div v-for="portfolio in portfolios[applicant._id]">
            <h5 class="mt-2"><strong>Email: </strong>{{applicant.email}}</h5>
            <p><a v-bind:href="getPortfolioURL(portfolio.portfolio_id)" target="_blank">{{getPortfolioURL(portfolio.portfolio_id)}}</a></p>
            <v-chip class="indigo white--text">
              Created: {{portfolio.created | moment}}
              <v-icon right>today</v-icon>
            </v-chip>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-for="standard in portfolio.standards" :key="standard.standard_id" v-if="standards[standard.standard_id]">
                <div slot="header">
                  <v-chip label class="red white--text" v-if="!standard.start_date">
                    <v-icon left>report_problem</v-icon>Not Started
                  </v-chip>
                  <v-chip label class="grey white--text" v-if="(!standard.url && !standard.details) && standard.start_date">
                    <v-icon left>flag</v-icon>Started: {{ standard.start_date | moment }}
                  </v-chip>
                  <v-chip label class="orange white--text" v-if="(standard.url || standard.details) && standard.update_date && !standard.submit_date">
                    <v-icon left>save</v-icon>Saved: {{ standard.update_date | moment }}
                  </v-chip>
                  <v-chip label class="green white--text" v-if="standard.submit_date">
                    <v-icon left>check</v-icon>Submitted: {{ standard.submit_date | moment }}
                  </v-chip>
                  <span class="standard-title">{{standards[standard.standard_id].title}}</span>
                </div>
                <v-card class="mt-2">
                  <h6 v-if="!standard.details && !standard.url && standard.option == -1">No submission yet.</h6>
                  <div v-if="standard.option != -1">
                    <h6>Selected Option:</h6>
                    <pre class="option grey lighten-3">{{standards[standard.standard_id].options[standard.option].name}}</pre>
                  </div>
                  <div v-if="standard.details" class="mt-3">
                    <h6>Submission:</h6>
                    <pre class="option grey lighten-3">{{standard.details}}</pre>
                  </div>
                  <div v-if="standard.url" class="mt-3">
                    <h6>URL:</h6>
                    <a v-bind:href="standard.url" target="_blank">{{standard.url}}</a>
                  </div>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-btn error @click.native="archiveApplicantDialog($event, applicant)">Archive Applicant<v-icon right>delete</v-icon></v-btn>
          </div>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="archiveDialog">
      <v-card>
        <v-card-row>
          <v-card-title>Are you sure?</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>Are you sure you want to archive the applicant <strong>{{archiveApplicant.last_name}}, {{archiveApplicant.first_name}}</strong>.</v-card-text>
        </v-card-row>
        <center v-if="archiving">
          <v-progress-circular indeterminate class="green--text" />
        </center>
        <v-card-row actions>
          <v-btn v-if="!archiving" class="green--text darken-1" flat="flat" @click.native="doArchive($event, archiveApplicant)">Yes</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import API from '../lib/API';

/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
export default {
  name: 'admin',
  data() {
    return {
      loading: true,
      orderBys: ['Last Name', 'Progress', 'Created', 'Updated'],
      sortOrder: 'descending',
      orderBy: 'Progress',
      portfolios: [],
      applicants: [],
      search: '',
      progress: {},
      standards: API.getStandards(),
      create: false,
      creatingApplicant: false,
      createError: false,
      archiveDialog: false,
      archiveApplicant: {},
      archiving: false,
      applicant: {
        first_name: '',
        last_name: '',
        email: '',
      },
    };
  },
  filters: {
    moment(date) {
      return moment(date).calendar();
    },
  },
  computed: {
    sortedApplicants() {
      let sorted = this.applicants;
      if (this.orderBy === 'Last Name') {
        sorted = this.applicants.sort((a, b) => {
          if (a.last_name < b.last_name) return -1;
          if (a.last_name > b.last_name) return 1;
          return 0;
        });
      } else if (this.orderBy === 'Progress') {
        sorted = this.applicants.sort((a, b) => {
          if (this.progress[a._id] < this.progress[b._id]) return -1;
          if (this.progress[a._id] > this.progress[b._id]) return 1;
          return 0;
        });
      } else if (this.orderBy === 'Created') {
        sorted = this.applicants.sort((a, b) => {
          const a_date = moment(this.portfolios[a._id][0].created).unix();
          const b_date = moment(this.portfolios[b._id][0].created).unix();
          if (a_date < b_date) return -1;
          if (a_date > b_date) return 1;
          return 0;
        });
      } else if (this.orderBy === 'Updated') {
        sorted = this.applicants.sort((a, b) => {
          const a_date = moment(this.portfolios[a._id][0].update_date).unix();
          const b_date = moment(this.portfolios[b._id][0].update_date).unix();
          if (a_date < b_date) return -1;
          if (a_date > b_date) return 1;
          return 0;
        });
      }

      if (this.search.trim() !== '') {
        const regExp = new RegExp(this.search, 'gi');
        return sorted.filter(a => a.first_name.match(regExp) || a.last_name.match(regExp));
      }

      return this.sortOrder === 'ascending' ? sorted : sorted.reverse();
    },
  },
  mounted() {
    this.loading = true;

    Promise.all([
      API
        .getApplicants()
        .then((applicants) => {
          applicants.forEach((a) => {
            a.view = false;
          });
          this.applicants = applicants;
        }),
      API
        .getPortfolios()
        .then((portfolios) => {
          this.portfolios = portfolios.reduce((all, p) => {
            all[p.applicant_id] = all[p.applicant_id] || [];
            all[p.applicant_id].push(p);
            this.progress[p.applicant_id] = Object.keys(p.standards).reduce((total, id) => {
              const standard = p.standards[id];
              if (standard.submitted) {
                total += 33;
              } else if (standard.url || standard.details) {
                total += 16.5;
              } else if (standard.update_date) {
                total += 5;
              }
              return total;
            }, 0);

            if (this.progress[p.applicant_id] === 99) {
              this.progress[p.applicant_id] = 100;
            }

            return all;
          }, {});
        }),
    ]).then(() => {
      this.loading = false;
    }).catch(() => {
      this.$router.push('/');
    });
  },
  methods: {
    createApplicant() {
      this.creatingApplicant = true;
      API
        .createApplicant(this.applicant)
        .then((applicant) => {
          this.createError = false;
          this.creatingApplicant = false;
          applicant.view = true;
          this.applicants.push(applicant);
          this.applicant.first_name = '';
          this.applicant.last_name = '';
          this.applicant.email = '';
          this.create = false;
        }).catch(() => {
          this.creatingApplicant = false;
          this.createError = true;
        });
    },
    createPortfolio(applicant) {
      applicant.view = false;
      API
        .createPortfolio(applicant._id)
        .then((portfolio) => {
          this.$set(this.portfolios, applicant._id, []);
          this.portfolios[applicant._id].push(portfolio);
          applicant.view = true;
        });
    },
    getPortfolioURL(portfolio_id) {
      return `${window.location.origin}/#/portfolio/${portfolio_id}`;
    },
    archiveApplicantDialog(event, applicant) {
      event.stopPropagation();
      this.archiveDialog = true;
      this.archiveApplicant = applicant;
    },
    doArchive(event, applicant) {
      event.stopPropagation();
      this.archiving = true;
      API
        .archiveApplicant(applicant._id)
        .then(() => {
          setTimeout(() => {
            const index = this.applicants.indexOf(applicant);
            this.applicants.splice(index, 1);
            this.archiving = false;
            this.archiveDialog = false;
          }, 800);
        });
    },
  },
};
</script>

<style scoped>
  .applicant-list {
    width: 70vw;
  }

  .applicant-progress {
    display: flex;
  }

  .details {
    font-family: inherit;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .expansion-panel li {
    padding: 1.5em;
  }

  .standard-title {
    font-size: 1.25em;
  }

  .expansion-panel__header > div {
    width: 100%;
  }
</style>
