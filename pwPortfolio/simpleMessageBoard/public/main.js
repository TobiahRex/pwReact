'use strict';

$(() => {
  getPosts();
  $('.create-post').on('click', createPost);
  $('.all-posts').on('click', '.delete-btn' ,deletePost);
  $('.all-posts').on('click', '.edit-btn' , watchEdit);
});

let getPosts = () => {
  $.get('/posts')
  .done((data) => {
    let dbPosts = data;
    console.log('dbData: ', dbPosts);
    renderPosts(dbPosts);
  });
}

let createPost = () => {
  event.preventDefault();
  let newAuthor = $('input.new-author').val();
  let newPost   = $('input.new-post').val();
  $('input.new-author').val('');
  $('input.new-post').val('');
  console.log('author: ', newAuthor, '\npost: ', newPost);
  $.post('/posts', {
    author : newAuthor,
    post   : newPost
  }).done(()=>{
    getPosts();
  });
};

let watchEdit = () => {
  let editId = event.toElement.parentElement.parentElement.parentElement.attributes.id.value;
  $("div").find("[id='" + editId + "']").find('.post-row').addClass('hidden');
  $("div").find("[id='" + editId + "']").find('.edit-row').removeClass('hidden');
  let $editField = $("div").find("[id='" + editId + "']").find('.template-edit-message');
  let $oldPost = $("div").find("[id='" + editId + "']").find('.template-post-message').text();
  $editField.val($oldPost);

  $('.save-btn').on('click', saveEdit);
  $('.cancel-btn').on('click', cancelEdit);
};
let saveEdit = event => {
  let editId = event.toElement.parentElement.parentElement.parentElement.parentElement.attributes.id.value;
  let $newPost = $("div").find("[id='" + editId + "']").find('.template-edit-message').val()
  $.ajax({
    url   :   `/posts/${editId}`,
    type  :   'PUT',
    data  :   {post : $newPost}
  })
  .done(()=>{
    getPosts();
  })
  .fail(()=>{
    alert('Failed to Update. Try Again.');
  })
};
let cancelEdit = () => {
  let editId = event.toElement.parentElement.parentElement.parentElement.parentElement.attributes.id.value;
  $("div").find("[id='" + editId + "']").find('.template-edit-message').val('');
  $("div").find("[id='" + editId + "']").find('.edit-row').addClass('hidden');
  $("div").find("[id='" + editId + "']").find('.post-row').removeClass('hidden');
}
let deletePost = event => {
  let $deleteId = event.toElement.parentElement.parentElement.parentElement.attributes.id.value;
  console.log('$deleteId: ', $deleteId);
  $.ajax({
    url   : `/posts/${$deleteId}`,
    type  : 'DELETE'
  })
  .done(()=> {
    getPosts();
  })
  .fail(()=> {
    alert('Failed To Delete');
  });
};
let renderPosts = dbPosts => {
  $('.append-here').empty();
  dbPosts.sort((a, b)=> {
    return b.sortD - a.sortD;
  });
  dbPosts.forEach(dbPost => {
    let $newPost = $('div.template').clone();
    $newPost.removeClass('template hidden').addClass('new-post').attr('id', dbPost.id);
    $newPost.find('.template-author-name').removeClass('template-author-name').addClass('author-Name').text(dbPost.author);
    let date = dbPost.date.slice(0,24);
    $newPost.find('.template-time-stamp').removeClass('template-time-stamp').addClass('time-stamp').text(date);
    $newPost.find('.template-post-message').removeClass('template-time-stamp').addClass('post-message').text(dbPost.post);
    $('div.append-here').append($newPost);
  });
};
