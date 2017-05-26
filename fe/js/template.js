'use strict';
var Template = {
		
		getLi : function(objTodo) {
			var $li = $( "<li>" ).attr("data-id", objTodo.id);
			var $div = $("<div>");
			var $input = $("<input class='toggle _btnComplete' type='checkbox'>");
			var $label = $("<label>");
			var $button = $("<button class='destroy _btnDestroy'>");
			
			//completed : 1 -> 완료된 일 
			//completed : 0 -> 미 완료된 일
			if(objTodo.completed){
				$input.attr("checked", true);
				$li.addClass("completed");
			} 
			$label.text(objTodo.todo);
			
			//돔 트리 만들기 
			$div.append($input)
			.append($label)
			.append($button);
			$li.append($div);
			
			return $li;
			
		},
		addLi : function($ul, $li){
			$ul.prepend($li);
		}
};