const closeCommentsBtn = document.querySelector('.comments-container .cursor-pointer');
const commentsContainer = document.querySelector('.comments-container');
const openCommentsBtns = document.querySelectorAll('.commentsBtn');


closeCommentsBtn.addEventListener('click', () => {
  commentsContainer.style.display = 'none';
});
openCommentsBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    commentsContainer.style.display = 'flex';
  })
})