import { fetchJSON, postJSON } from './fetchHelpers';
import standards from './standards';

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/' : 'https://galvanize-admissions-portfolio-api.galvanize.network/api/v1/';

/* eslint-disable camelcase */
export default class API {
  static getApplicants() {
    return fetchJSON(`${API_URL}applicant`);
  }
  static getPortfolios() {
    return fetchJSON(`${API_URL}portfolio`);
  }
  static getPortfolio(portfolioId) {
    return fetchJSON(`${API_URL}portfolio/${portfolioId}`);
  }
  static createApplicant(applicant) {
    return postJSON(`${API_URL}applicant`, applicant);
  }
  static createPortfolio(applicant_id) {
    return postJSON(`${API_URL}portfolio/${applicant_id}`);
  }
  static getApplicant(applicantId) {
    return fetchJSON(`${API_URL}applicant/${applicantId}`);
  }
  static startStandard(portfolioId, standardId, option) {
    return postJSON(`${API_URL}portfolio/${portfolioId}/standard/${standardId}/${option}/start`);
  }
  static saveStandard(portfolioId, standardId, submission) {
    return postJSON(`${API_URL}portfolio/${portfolioId}/standard/${standardId}/save`, submission);
  }
  static submitStandard(portfolioId, standardId, submission) {
    return postJSON(`${API_URL}portfolio/${portfolioId}/standard/${standardId}/submit`, submission);
  }
  static getStandards() {
    return standards.map((s) => {
      /* eslint-disable no-param-reassign */
      s.url = '';
      s.details = '';
      s.begin = false;
      s.submitted = false;
      s.finishedSubmitting = false;
      s.loading = false;
      s.option = -1;
      return s;
    });
  }
}
