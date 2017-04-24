import { fetchJSON, postJSON } from './fetchHelpers';

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
    return fetch(`${API_URL}portfolio/${portfolioId}/standard/${standardId}/${option}/start`, {
      method: 'POST',
    }).then(res => res.json());
  }
  static saveStandard(portfolioId, standardId, submission) {
    return fetch(`${API_URL}portfolio/${portfolioId}/standard/${standardId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    }).then(res => res.json());
  }
  static submitStandard(portfolioId, standardId, submission) {
    return fetch(`${API_URL}portfolio/${portfolioId}/standard/${standardId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    }).then(res => res.json());
  }
  static getStandards() {
    return [{
      id: 0,
      title: 'The prospective student demonstrates an active interest in coding',
      why: 'Switching careers is not a small task to undertake and you want to be certain that you enjoy writing code and would like to do it as a full-time job.',
      options: [{
        name: 'Create something with Scratch',
        content: `If you’ve never written code before, create something using <a href="https://scratch.mit.edu/projects/editor/?tip_bar=getStarted" target="_blank">Scratch</a>, which is like programming with your mouse (note: Flash is required). Create and submit a project which meets the following requirements:
<ul>
<li>a. At a minimum have one character move across the screen</li>
<li>b. There is no maximum amount of work to do, you can make whatever you want</li>
<li>c. Share a link to the project along with a paragraph describing what you created and why you made it that way.</li>
</ul>
`,
      }, {
        name: 'Spend at least five hours learning HTML, CSS and JavaScript',
        content: 'Spend at least five hours (the hours can be spread out over several days) learning HTML, CSS and JavaScript on <a href="https://www.freecodecamp.com/" target="_blank">FreeCodeCamp</a>, <a href="https://www.codecademy.com/" target="_blank">Code Academy</a>, <a href="http://www.theodinproject.com/courses?ref=home" target="_blank">The Odin Project</a>, <a href="https://teamtreehouse.com/" target="_blank">Team TreeHouse</a>, <a href="https://www.udacity.com/" target="_blank">Udacity</a> or another online-learning platform. Keep a learning journal that describes what you’ve learned, what was easy for you and what was a challenge. If you complete a project, figure out a way to share your code.',
      }, {
        name: 'Attend at least 2 meetups geared toward people learning to code',
        content: 'Attend at least <a href="https://www.meetup.com/find/tech/?allMeetups=false&radius=50&userFreeform=80202&gcResults=Denver%2C+CO+80202%2C+USA%3AUS%3AColorado%3ADenver+County%3ADenver%3Anull%3A80202%3A39.7541032%3A-105.00022419999999&change=yes&sort=recommended&eventFilter=mysugg" target="_blank">2 meetups</a> geared toward people who are learning to code. Keep a journal describing what you you learned, and what you want to learn more about. Check out this <a href="https://docs.google.com/document/d/11wG0LD31DDNUEbgrmQcnkOtTk79g0G8HOpgVgV_jyFQ/edit?usp=sharing" target="_blank">example of a learning journal</a>.',
      }, {
        name: 'Create a project using HTML and CSS with JavaScript or jQuery',
        content: 'Create a project using HTML, CSS, JavaScript or JQuery, push your code to github, and submit the URL of your repo.',
      }],
    }, {
      id: 1,
      title: 'The prospective student demonstrates problem solving skills ',
      why: 'Software development is about solving problems. Regardless of the programming language or technology, a successful developer needs to have good problem solving skills. Not even 20+ year senior devs can write code that works the first time every time. There are bugs and unforeseeable hurdles in the process and success is about debugging the code quickly and efficiently.',
      options: [{
        name: 'Logic Puzzle',
        content: 'Solve one standard logic puzzle and submit your solution. You can find an explanation of <a href="http://www.cis.upenn.edu/~matuszek/cis554-2014/Images/how-to-solve-logic-problems.png" target="_blank">how to solve this type of logic puzzle here</a> and <a href="http://www.cis.upenn.edu/~matuszek/cis554-2014/Images/logic_puzzles_2014.png" target="_blank">sample problems here</a>.',
      }, {
        name: 'Describe a Process',
        content: `Submit a description of your process for solving for one of these problems:
<ul>
<li>Problem 1. A lamp is not turning on in your living room. Describe the process of how you would figure out why the lamp is not working.</li>
<li>Problem 2. Suppose you have three CPUs. Each needs to be connected to the same keyboard, mouse, and monitor (each of which are able to connect to multiple CPUs). You want your set-up to be organized, so find a way to make all nine connections without any of the cables crossing each other.</li>
</ul>
`,
      }, {
        name: 'Solve a Project Euler Problem',
        content: 'Solve one Problem from <a href="https://projecteuler.net/archives" target="_blank">Project Euler</a> and submit your solution.',
      }, {
        name: 'Demonstrate Your Problem Solving Skills',
        content: 'Create an artifact (a youtube video, an essay, or something else) where you demonstrate your problem solving skills.',
      }],
    }, {
      id: 2,
      title: 'The prospective student demonstrates a desire to create things',
      why: 'Good developers must be willing to try new things and want to bring new things into the world. We want to see what',
      options: [{
        name: 'Previous Creative Project',
        content: 'Send us a previous creative project, or a summary of the project.',
      }, {
        name: 'Start and Complete Creative Project',
        content: `Start and complete a new creative project. Potential ideas:
<ul>
<li>Write a single subject blog post</li>
<li>Write and record a song</li>
<li>Complete a craft project</li>
<li>Complete an artistic/graphic design project</li>
<li>Cook a recipe you haven’t tried before</li>
</ul>
`,
      }],
    }, {
      id: 3,
      title: 'The prospective student demonstrates grit and resilience',
      why: 'As a WDI student, resiliency is a quality that you will need every day. Developers make mistakes in order to learn, and being able to bounce back from failures will help you improve. With the stress of the course, resiliency is the only way to keep stress levels balanced. The process of web development also requires grit, since so much time is spent solving errors.',
      options: [{
        name: 'Grit Scale Assessment',
        content: 'Take the <a href="http://www.sas.upenn.edu/~duckwort/images/12-item%20Grit%20Scale.05312011.pdf" target="_blank">Grit Scale Assessment</a> and score your results (please answer the questions honestly). After you’ve tabulated your results, do some research on the correlation between grit and student success in school. If you scored low on the Grit Scale, write an explanation on how you will increase your ‘grittiness’ prior to your first day as a Galvanize Student. If you scored high on the grit scale, write an explanation of how your grit and resilience has helped you in the past, and how you will use it during tough times in the Web Development Immersive Program. If you scored in the middle, talk about your ‘grittiness’ strengths and areas for improvement.',
      }, {
        name: 'Create an Artifact about Grit or Resiliency',
        content: 'Create an artifact (a youtube video, an essay, or something else) where you describe the mindsets, skills and habits you have that help you be gritty and resilient in when you face adversity. Also, discuss your areas for improvement.',
      }, {
        name: 'Write an Essay on Growth Mindset',
        content: 'Write a short essay explaining what Growth Mindset means to you. If you need to learn more about Growth Mindset, check out <a href="https://hbr.org/2016/01/what-having-a-growth-mindset-actually-means" target="_blank">this article</a>, <a href="http://choiceschools.com/wp-content/uploads/2016/02/10-Growth-Mindset-Statements.jpg" target="_blank">this infographic</a> or find another resource based on the work of Dr. Carol Dweck.',
      }],
    }].map((s) => {
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
