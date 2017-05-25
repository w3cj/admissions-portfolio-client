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
    <v-tabs class="mt-2" grow icons>
      <v-tab-item href="#active-applicants" class="grey darken-3" slot="activators">
        Active
        <v-icon>list</v-icon>
      </v-tab-item>
      <v-tab-item href="#archived-applicants" class="grey darken-3" slot="activators">
        Archived
        <v-icon>archive</v-icon>
      </v-tab-item>
      <v-tab-content id="active-applicants" slot="content">
        <v-card>
          <applicants
            v-if="!loading"
            :sortedApplicants="sortedActiveApplicants"
            :portfolios="portfolios"
            :progress="progress"
            :standards="standards"
            :archiveApplicantDialog="archiveApplicantDialog"
            :createPortfolio="createPortfolio"></applicants>
        </v-card>
      </v-tab-content>
      <v-tab-content id="archived-applicants" slot="content">
        <v-card>
          <applicants
            v-if="!loading"
            :sortedApplicants="sortedArchivedApplicants"
            :portfolios="portfolios"
            :progress="progress"
            :standards="standards"
            :hideArchiveButton="true"></applicants>
        </v-card>
      </v-tab-content>
    </v-tabs>


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
import Applicants from './Applicants';
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
export default {
  name: 'admin',
  components: {
    applicants: Applicants,
  },
  data() {
    return {
      loading: true,
      orderBys: ['Last Name', 'Progress', 'Created', 'Updated'],
      sortOrder: 'descending',
      orderBy: 'Progress',
      portfolios: [],
      applicants: [],
      archivedApplicants: [],
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
  computed: {
    sortedActiveApplicants() {
      return this.sortApplicants(this.applicants);
    },
    sortedArchivedApplicants() {
      return this.sortApplicants(this.archivedApplicants);
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
        .getArchivedApplicants()
        .then((archivedApplicants) => {
          archivedApplicants.forEach((a) => {
            a.view = false;
          });
          this.archivedApplicants = archivedApplicants;
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
            applicant.view = false;
            this.archivedApplicants.push(applicant);
            this.applicants.splice(index, 1);
            this.archiving = false;
            this.archiveDialog = false;
          }, 800);
        });
    },
    sortApplicants(applicants) {
      let sorted = applicants;
      if (this.orderBy === 'Last Name') {
        sorted = applicants.sort((a, b) => {
          if (a.last_name < b.last_name) return -1;
          if (a.last_name > b.last_name) return 1;
          return 0;
        });
      } else if (this.orderBy === 'Progress') {
        sorted = applicants.sort((a, b) => {
          if (this.progress[a._id] < this.progress[b._id]) return -1;
          if (this.progress[a._id] > this.progress[b._id]) return 1;
          return 0;
        });
      } else if (this.orderBy === 'Created') {
        sorted = applicants.sort((a, b) => {
          const a_date = moment(this.portfolios[a._id][0].created).unix();
          const b_date = moment(this.portfolios[b._id][0].created).unix();
          if (a_date < b_date) return -1;
          if (a_date > b_date) return 1;
          return 0;
        });
      } else if (this.orderBy === 'Updated') {
        sorted = applicants.sort((a, b) => {
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
};
</script>
