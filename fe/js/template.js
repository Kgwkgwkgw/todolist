'use strict';
var Template = {
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
    },
    popup : function(title, content, close_text) {
      title = title || "알림";
      content = content || "일시적 오류가 발생하였습니다.";
      close_text = close_text || "확인";
      var $layer_wrap = $("<div class='layer_wrap'>");
      var $layer = $("<div class='layer'>");
      var $layer_inner = $("<div class='layer_inner'>");
      var $title = $("<strong class='title'>");
      var $content = $("<p class='content'>");
      var $btn_close = $("<button class='btn_close'>");

      $title.text(title);
      $content.text(content);
      $btn_close.text(close_text);

      //돔 트리 만들기
      $layer.append($layer_inner);
      $layer_inner.append($title)
      .append($content)
      .append($btn_close);
      $layer_wrap.append($layer);

      return $layer_wrap;
    }
}
