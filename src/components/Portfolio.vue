<template>
  <div class="portfolio-standards mt-2">
    <v-alert error v-bind:value="true">
      Do not share this URL. This portfolio submission form is for YOU only.
    </v-alert>
    <v-alert success v-bind:value="submittedAll" class="mt-4">
      🎉 We have received all of your submissions. Your admissions advisor will be in touch soon.
    </v-alert>
    <div v-if="loading">
      <center>
        <v-progress-circular
        indeterminate
        v-bind:size="100"
        v-bind:width="2"
        class="orange--text"
        />
      </center>
    </div>
    <div v-if="error">
      <h2 class="text-xs-center">Portfolio not found.</h2>
    </div>
    <div v-if="!loading && !error">
      <h2>Hello {{applicant.first_name}} {{applicant.last_name}}!</h2>
      <div v-if="!submittedAll">
        <p>Welcome! In completing this portfolio, you will demonstrate you have, or can acquire, the skills, habits and mindsets of a successful Web Development Immersive Student.</p>
        <h3>How does this work? </h3>
        <p>For each of the 3 Standards below, you will select one option for how to demonstrate the skill described in the standard. If you would prefer to demonstrate the standard in a way other than the options described, you can create and submit an alternative document that demonstrates your skill in this area.</p>
        <h3>Why do I have to submit a portfolio?</h3>
        <p>Instead of a ‘one-size fits all’ assessment to determine whether or not you have the skills described in our standards, we want to offer you different options for proving your competency.
          Completing work for the portfolio also requires that you engage in self-directed learning, which is an essential skill for modern web developers.</p>
      </div>
      <div v-else>
        <h3>Portfolio Status</h3>
        <p><v-icon large class="green--text text--darken-2">check_circle</v-icon> Submitted</p>
      </div>
      <h3>What happens after I submit my portfolio?</h3>
      <p>Completing the Admissions Portfolio will take you between 5-10 hours. If the work in your portfolio demonstrates that you have the skills described in the standards, you will be invited to the final step in our interview process, a technical discussion with an instructor. If the work in your portfolio does not demonstrate the skills described in the standards, we’ll send you notes on what to improve, and you’ll be able to make changes and submit your portfolio again.</p>
      <h3>How do I know I'm on the right track?</h3>
      <p>Take a look at the <a href="https://docs.google.com/document/d/1qF41j_-hlCwKKl1o9CmgLcK-QkM8w5VJnCIYZuXoG7A" target="_blank">Admissions Portfolio Scoring Rubric.</a></p>
      <h3>Portfolio Standards</h3>
      <v-expansion-panel expand class="mb-4">
        <v-expansion-panel-content v-for="(standard, i) in standards" :key="i">
          <div slot="header">
            <h5>
              <v-icon v-if="standard.submitted" class="green--text text--darken-2">check_circle</v-icon>
              <v-icon v-if="!standard.submitted && !standard.begin" class="orange--text text--darken-2">edit</v-icon>
              <v-icon v-if="!standard.submitted && standard.begin" class="orange--text text--darken-2">save</v-icon>
              <strong class="standard-title">Standard {{i + 1}}:</strong> {{standard.title}}
            </h5>
          </div>
          <v-card>
            <v-card-text>
              <div v-show="!standard.submitted">
                <h5><strong>Why?</strong></h5>
                <p>{{standard.why}}</p>
                <h5><strong>Options:</strong></h5>
                <span>You will be required to choose 1 option.</span>
                <div v-for="(option, index) in standard.options">
                  <h6><v-radio primary :label="'Option ' + (index + 1) + ': ' + option.name" v-model="standard.option" :value="index" light /></h6>
                  <pre class="option" v-html="option.content"></pre>
                  <br>
                </div>
                <v-alert warning v-bind:value="standard.option == -1">
                  Choose an option.
                </v-alert>
                <div v-if="standard.option != -1 && !standard.begin">
                  <v-btn class="orange darken-1" v-on:click.native="startStandard(standard)">I Have Started Working on this Standard</v-btn>
                  <br>
                  <span>Click the button above when you begin working on this standard. It is OK if you change what option you decide to do.</span>
                </div>
                <div v-if="standard.begin" v-show="!standard.loading">
                  <h6>Submission:</h6>
                  <p>{{standard.options[standard.option].name}}</p>
                  <span>Enter your submission details below. URL can be a link to a document, image, video, code sample, github repo etc. Details can be a description of the URL or a write up of the given option.</span>
                  <v-row row>
                    <v-col xs2>
                      <v-subheader>URL:</v-subheader>
                    </v-col>
                    <v-col xs10>
                      <v-text-field
                        v-model="standard.url"
                        name="url"
                        label="URL"
                        prepend-icon="link"
                        v-bind:rules="urlRules"
                        type="url"
                      ></v-text-field>
                    </v-col>
                    <v-col xs2>
                      <v-subheader>Details:</v-subheader>
                    </v-col>
                    <v-col xs10>
                      <v-text-field
                        v-model="standard.details"
                        name="details"
                        label="Details"
                        prepend-icon="description"
                        multi-line
                      ></v-text-field>
                    </v-col>
                    <v-col xs2>
                    </v-col>
                    <v-col xs10>
                      <v-btn class="orange darken-1" v-on:click.native="saveStandard(standard)" :disabled="!validStandard(standard)">Save</v-btn>
                      <v-dialog v-model="standard.finishedSubmitting" overlay>
                        <v-btn slot="activator" class="green darken-1" v-if="validStandard(standard) && (standard.url || standard.details)" :disabled="!validStandard(standard)">Submit</v-btn>
                        <v-card-row>
                          <v-card-title>Are you sure?</v-card-title>
                        </v-card-row>
                        <v-card-row>
                          <v-card-text>
                            This will send your submission to the admissions team for:
                            <br />
                            <br />
                            Standard: <strong>{{standard.title}}</strong>
                            <br />
                            Option: <strong>{{standard.options[standard.option].name}}</strong>
                            <br />
                            <br />
                            Be sure to double check your URL and details.
                            <br />
                            <small>Click anywhere outside this dialog to cancel.</small>
                          </v-card-text>
                        </v-card-row>
                        <v-card-row actions>
                          <v-btn class="green--text darken-1" flat="flat" @click.native="submitStandard(standard); standard.finishedSubmitting = false;">Submit</v-btn>
                        </v-card-row>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <center v-if="standard.loading">
                <v-progress-circular
                indeterminate
                v-bind:size="100"
                v-bind:width="2"
                class="orange--text"
                />
              </center>
              <div v-if="standard.submitted && !standard.loading">
                <v-alert success v-bind:value="true">
                  Congrats! 🎉 We have received your submission.
                </v-alert>
                <v-card class="mt-2">
                  <div class="">
                    <h6>Selected Option:</h6>
                    <pre class="option grey lighten-3">{{standard.options[standard.option].name}}</pre>
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
              </div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-snackbar
        :timeout="2000"
        top
        v-model="snackbar">
        {{snackbar_message}}
        <v-btn flat class="pink--text" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import isUri from 'isuri';
import API from '../lib/API';

const httpRegex = isUri.createUriRegex({ scheme: [/https?/] });

/* eslint-disable no-param-reassign */
export default {
  name: 'portfolio',
  computed: {
    submittedAll() {
      return this.standards.filter(s => !s.submitted).length === 0;
    },
  },
  mounted() {
    localStorage.portfolio_id = this.$route.params.portfolio_id;

    API
      .getPortfolio(this.$route.params.portfolio_id)
      .then((portfolio) => {
        this.portfolio = portfolio;

        if (portfolio) {
          API
          .getApplicant(portfolio.applicant_id)
          .then((applicant) => {
            this.applicant = applicant;
            this.loading = false;
          });

          this.standards.forEach((standard) => {
            standard.begin = portfolio.standards[standard.id].begin;
            standard.url = portfolio.standards[standard.id].url;
            standard.details = portfolio.standards[standard.id].details;
            standard.option = portfolio.standards[standard.id].option;
            standard.submitted = portfolio.standards[standard.id].submitted;
          });
        } else {
          this.error = true;
          this.loading = false;
        }
      });
  },
  data() {
    return {
      loading: true,
      error: false,
      applicant: {},
      standards: API.getStandards(),
      snackbar: false,
      snackbar_message: '',
      urlRules: [(url) => {
        if (url.trim() && !httpRegex.test(url)) {
          return 'Invalid URL';
        }
        return true;
      }],
    };
  },
  methods: {
    startStandard(standard) {
      standard.loading = true;
      API
        .startStandard(this.portfolio.portfolio_id, standard.id, standard.option)
        .then(() => {
          standard.begin = true;
          this.finishLoading(standard, 'Standard Started');
        });
    },
    validStandard(standard) {
      return !standard.url.trim() || httpRegex.test(standard.url);
    },
    saveStandard(standard) {
      if (!this.validStandard(standard)) return;

      standard.loading = true;
      API
        .saveStandard(this.portfolio.portfolio_id, standard.id, {
          url: standard.url,
          details: standard.details,
          option: standard.option,
        })
        .then(() => {
          this.finishLoading(standard, 'Standard Saved');
        });
    },
    submitStandard(standard) {
      if (!this.validStandard(standard)) return;

      standard.loading = true;
      API
        .submitStandard(this.portfolio.portfolio_id, standard.id, {
          url: standard.url,
          details: standard.details,
          option: standard.option,
        })
        .then(() => {
          this.finishLoading(standard, 'Standard Submitted').then(() => {
            standard.submitted = true;
            this.snackbar_message = 'Thank you for your submissions. Your admission advisor will be in contact soon.';
            this.snackbar = true;
          });
        });
    },
    finishLoading(standard, message) {
      return new Promise((resolve) => {
        setTimeout(() => {
          standard.loading = false;
          this.snackbar_message = message;
          this.snackbar = true;
          resolve();
        }, 600);
      });
    },
  },
};
</script>

<style>
  p {
    font-size: 1.5em;
  }

  .option {
    font-family: inherit;
    font-size: 1.25em;
    word-wrap: break-word;
    white-space: pre-wrap;
    margin-left: 1em;
    margin-top: 1.5em;
  }

  .option ul {
    margin-left: 1em;
    margin-top: -2em;
    margin-bottom: -2em;
  }

  .option li {
    padding: 0em !important;
    margin-bottom: -2em;
  }

  .expansion-panel li {
    padding: 1.5em;
  }

  h6 .input-group__details {
    min-height: 0px;
    padding-top: 0px;
  }

  div.expansion-panel__body {
    margin-top: 2em;
  }
</style>
