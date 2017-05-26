(function (window, $) {
	$(function(){
		'use strict';

		var regCheckWhitespace = /.*\S+.*/;
		var COMPLETED = 1;
		var UNCOMPLETED = 0;
		var COMPLETION_MODE = "COMPLETION";

		// 투두 목록 다 가져옵니다.
		getList();

		// Your starting point. Enjoy the ride!
		var $ul = $(".todo-list");

		// 투두 입력 창 이벤트 바인딩
		$(".new-todo").on("keyup",function(e){
			// enter key pressed
			if(e.which == 13) {
				var entered = $(this).val();
				console.log(regCheckWhitespace.test(entered));
				addTodo($(this).val());
			}
		});

		// 투두 완료/ 미완료 버튼 이벤트 델리게이션
		$(".main").on("click","._btnComplete", function(e){
			var $li = $(this).parents("li");
			var currentStatus = $li.hasClass("completed") ? COMPLETED : UNCOMPLETED;
			// xor 연산
			var tobeStatus = currentStatus ^ 1 ;
			var id = $li.attr("data-id");

			toggleCompletion($li, tobeStatus, id);
		});

		// 투두 삭제 버튼 이벤트 델리게이션
		$(".main").on("click","._btnDestroy", function(e){
			var $li = $(this).parents("li");
			var id = $li.attr("data-id");
			$.ajax({
				method: "DELETE",
				url : "/api/todos/"+id,
				headers: {
					"X-HTTP-Method-Override" : "DELETE"}
			}).done(function( res ) {
				$li.slideUp("slow", function(){ $(this).remove(); })
				getCount(UNCOMPLETED, COMPLETION_MODE);

			})
		});

		// 필터링 버튼 클릭 시 selected 클래스 추가/제거 (공통)
		$("._btn_filter").on("click", function(e){
			// a태그 기본 이벤트 막음
				e.preventDefault();
				$("._btn_filter").removeClass("selected");
				$(this).addClass("selected");
		})
		// 투두 all버튼 이벤트 바인딩 ( 투두 전체 리스트 가져옴)
		$("#btn_all").on("click", function(e){
			getList();
		})

		// 투두 active버튼 이벤트 바인딩 ( 미완료 리스트 가져옴)
		$("#btn_active").on("click", function(e){
			getList(UNCOMPLETED, COMPLETION_MODE);
		})

		// 투두 completed버튼 이벤트 바인딩 ( 완료 리스트 가져옴)
		$("#btn_completed").on("click", function(e){
			getList(COMPLETED, COMPLETION_MODE);
		})

		// 투두 완료/미완료 처리 함수
		function toggleCompletion($li, tobeStatus, id) {
			$.ajax({
				method: "PUT",
				url : "/api/todos/"+id+"/completion",
				headers: {
					"X-HTTP-Method-Override" : "PUT"},
				data: { completed : tobeStatus }
			}).done(function( res ) {
				$li.toggleClass("completed");
				getCount(UNCOMPLETED, COMPLETION_MODE);
			});
		}

		// 투두 추가 처리 함수
		function addTodo(strTodo) {
			$.ajax({
			  method: "POST",
			  url: "/api/todos",
			  headers: {'Content-Type' :"application/json"},
			  data: JSON.stringify({ todo: strTodo })
			})
			  .done(function( res ) {
				  var $li = Template.getLi(res);
				  Template.addLi($ul, $li);
				  getCount(UNCOMPLETED,COMPLETION_MODE);
			  });
		}

		// 투두리스트 가져오는 함수
		// mode - 전체 검색이 아닌 조건을 걸 모드 ( 전체 검색 할지 아니면 완성 혹은 미완성 투두 개수 셀 것인지에 대한 변수)
		// (매개 변수 없이 호출 시 전체검색)
		// isCompleted - 완료한 일 가져올지 , 미완료한 일 가져올지에 대한 변수
		function getList(isCompleted, mode){
			$.ajax({
				method: "GET",
				url: "/api/todos",
				contentType:"application/json",
				beforeSend: function()
			    {
							$(".todo-list").empty();
			        $(".dimmed_wrap").removeClass("hide");
			    },
				data : {
					filtering : mode,
					completed: isCompleted
					}
			}).done(function( res ) {
				$.each(res, function(idx, obj){
					var $li = Template.getLi(obj);
					Template.addLi($ul,$li);
				})
				// 미 완료 투두 개수 세기
				getCount(UNCOMPLETED, COMPLETION_MODE);
				$(".loading_wrap").addClass("hide");
			});
		}

		// 투두 개수 세는 함수
		// mode - 전체 검색이 아닌 조건을 걸 모드 ( 전체 검색 할지 아니면 완성 혹은 미완성 투두 개수 셀 것인지에 대한 변수)
		// (매개 변수 없이 호출 시 전체검색)
		// isCompleted - 완료한 일 셀지, 미완료한 일 셀지에대한 변수
		function getCount(isCompleted,mode){
			$.ajax({
				method: "GET",
				url: "/api/todos/count",
				data : {
						filtering : mode,
						completed: isCompleted
						}
			}).done(function(res){
				$("#count").text(res);
			});
		}

	});
})(window, $);
