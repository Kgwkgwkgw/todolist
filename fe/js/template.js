window.todo = window.todo || {};
window.todo.template = (function ($){
  'use strict';
  return {
    getLi : function(objTodo) {
      var $li = $( "<li class='item'>" ).attr("data-id", objTodo.id);
      var $div = $("<div class='view'>");
      var $checkbox = $("<input class='toggle _btnComplete' type='checkbox'>");
      var $label = $("<label>");
      var $button = $("<button class='destroy _btnDestroy'>");
      var $text_edit = $("<input type='text' class='edit'>");
      //completed : 1 -> 완료된 일
      //completed : 0 -> 미 완료된 일
      if(objTodo.completed){
        $checkbox.attr("checked", true);
        $li.addClass("completed");
      }
      $label.text(objTodo.todo);

      //돔 트리 만들기
      $div.append($checkbox)
      .append($label)
      .append($button);
      $li.append($div);
      $li.append($text_edit);
      return $li;
    }
  }
}(jQuery)
