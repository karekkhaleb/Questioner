const showTagFormBtn = document.querySelector('#create-tag');
const tagForm = document.querySelector('.tag-form');
const meetupPeopleBtns = document.querySelectorAll('.meetup-people-btn');
const usersContainer = document.querySelector('.users-container');
const questionsBtns = document.querySelectorAll('.questions-btn');
const questionsContainer = document.querySelector('.questions-container');
const selectTagSelects = document.querySelectorAll('.select-tag');

// EventListeners
// show the form to create a tag
showTagFormBtn.addEventListener('click', () => {
  tagForm.classList.add('show-tag-form');
});
// hide the form to create a tag
tagForm.addEventListener('mouseleave', () => {
  tagForm.classList.remove('show-tag-form');
});
// show the users
meetupPeopleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    usersContainer.classList.add('show-users');
  });
});
// hide the users
usersContainer.addEventListener('click', (e) => {
  if (e.target === usersContainer) {
    usersContainer.classList.remove('show-users');
  }
});

// show questions for a meetup
questionsBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    questionsContainer.classList.add('show-questions');
  });
});

// hide questions
questionsContainer.addEventListener('click', (e) => {
  if (e.target === questionsContainer) {
    questionsContainer.classList.remove('show-questions');
  }
});

// add tag to a meetup
selectTagSelects.forEach((select) => {
  select.addEventListener('change', (e) => {
    // eslint-disable-next-line no-alert
    alert(`you added tag: ${e.target.value}`);
  });
});
