<template lang="html">
  <div>
    <div v-if="sortedApplicants.length == 0">
      <blockquote>
        No applicants to show.
      </blockquote>
    </div>
    <v-expansion-panel v-if="sortedApplicants.length > 0" expand class="applicant-list mt-4 mb-4">
      <v-expansion-panel-content v-for="applicant in sortedApplicants" :key="applicant._id" v-model="applicant.view">
        <div slot="header">
          <h5>
            {{applicant.last_name}}, {{applicant.first_name}}
            <span v-for="portfolio in portfolios[applicant._id]" class="hidden-xs-only">
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
          <v-btn @click.native="createPortfolio(applicant)" class="orange darken-1 white--text" v-if="!portfolios[applicant._id] || portfolios[applicant._id].length == 0">Create Portfolio</v-btn>
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
                  <v-chip label class="green white--text" v-if="standard.status_id == 1">
                    <v-icon left>check</v-icon>Reviewed: {{ standard.status_date | moment }}
                  </v-chip>
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
                  <div v-if="standard.submitted && standard.status_id != 1" class="mt-3">
                    <v-layout row wrap>
                      <v-flex xs4>
                        <v-select
                          :items="statuses"
                          v-model="standard.update_status"
                          label="Select Status"
                          dark
                          single-line
                          auto
                        ></v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-btn @click.native="updateStandardStatus(portfolio.portfolio_id, standard, applicant)" class="indigo white--text" :disabled="!standard.update_status">Update Status</v-btn>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-btn v-if="!hideArchiveButton" error class="white--text" @click.native="archiveApplicantDialog($event, applicant)">Archive Applicant<v-icon light right>delete</v-icon></v-btn>
          </div>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import moment from 'moment';
import API from '../lib/API';

export default {
  name: 'applicants',
  props: ['sortedApplicants', 'portfolios', 'progress', 'standards', 'hideArchiveButton', 'archiveApplicantDialog', 'createPortfolio'],
  data() {
    return {
      statuses: [
        {
          id: 1,
          text: 'Reviewed',
        },
        {
          id: 0,
          text: 'Re-Submit',
        },
      ],
    };
  },
  methods: {
    getPortfolioURL(portfolio_id) {
      return `${window.location.origin}/#/portfolio/${portfolio_id}`;
    },
    updateStandardStatus(portfolio_id, standard, applicant) {
      API
        .updateStandardStatus(portfolio_id, standard.standard_id, standard.update_status.id)
        .then(() => {
          this.$set(standard, 'status_id', standard.update_status.id);
          const portfolio = this.portfolios[applicant._id][0];
          const readyForInterview = Object.keys(portfolio.standards).every((standard_id) => {
            return portfolio.standards[standard_id].status_id == 1;
          });
          if (readyForInterview) {
            applicant.view = false;
          }
        });
    },
  },
  filters: {
    moment(date) {
      return moment(date).calendar();
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
