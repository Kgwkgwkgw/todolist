(function (window, $) {
	$(function(){
		'use strict';
		// 공백으로만 이루어져있지는 않은지 검사하는 정규식
		var regCheckNoWhitespace = /.*\S+.*/;
		var COMPLETED = 1;
		var UNCOMPLETED = 0;
		var COMPLETION_MODE = "COMPLETION";

		// 투두 목록 다 가져옵니다.
		getList();

		var $ul = $(".todo-list");

		// 투두 입력 창 이벤트 바인딩
		$(".new-todo").on("keydown",function(e) {
			// 엔터키 눌렸을 떄
			if(e.which == 13) {
				var entered = $(this).val();
				if(regCheckNoWhitespace.test(entered)) {
						addTodo($(this).val());
				}
				else {
					Template.popup("알림", "내용을 입력 해주세요^^");
					$(".layer_wrap").removeClass("hide");
				}
				// 인풋 값 초기화
				$(this).val('');
			}
		});

		// 투두 완료/ 미완료 버튼 이벤트 델리게이션
		$(".main").on("click","._btnComplete", function(e) {
			var $li = $(this).parents("li");
			var currentStatus = $li.hasClass("completed") ? COMPLETED : UNCOMPLETED;
			// xor 연산
			var tobeStatus = currentStatus ^ 1 ;
			var id = $li.attr("data-id");

			toggleCompletion($li, tobeStatus, id);
		});

		// 투두 삭제 버튼 이벤트 델리게이션
		$(".main").on("click","._btnDestroy", function(e) {
			var $li = $(this).parents("li");
			var id = $li.attr("data-id");

			removeTodo(id, $li);
		});

		// 투두 완료 목록 삭제
		$("#_clearCompleted").on("click", function() {
				var $completedLi = $(".completed");
				var arrIdObj = [];

				// id를 키로 갖는 객체 배열 생성
				$completedLi.each(function(index) {
					var id = $(this).attr("data-id");
					var obj = {};
					obj["id"] = id;
					arrIdObj.push(obj);
				});
				removeTodoList(arrIdObj, $completedLi);
		})

		// 필터링 버튼 클릭 시 selected 클래스 추가/제거 (공통)
		$("._btn_filter").on("click", function(e) {
			// a태그 기본 이벤트 막음
				e.preventDefault();
				$("._btn_filter").removeClass("selected");
				$(this).addClass("selected");
		})

		// 투두 all버튼 이벤트 바인딩 ( 투두 전체 리스트 가져옴)
		$("#btn_all").on("click", function(e) {
			getList();
		})

		// 투두 active버튼 이벤트 바인딩 ( 미완료 리스트 가져옴)
		$("#btn_active").on("click", function(e) {
			getList(UNCOMPLETED, COMPLETION_MODE);
		})

		// 투두 completed버튼 이벤트 바인딩 ( 완료 리스트 가져옴)
		$("#btn_completed").on("click", function(e) {
			getList(COMPLETED, COMPLETION_MODE);
		})

		$(".btn_close").on("click", function(e) {
				$(".layer_wrap").addClass("hide");
		})

		$(document).ajaxError(function (event, xhr, ajaxOptions, thrownError) {
				console.log(xhr.responseJSON.errors);
				Template.popup("알림", "일시적 오류가 발생하였습니다.");
				$(".layer_wrap").removeClass("hide");
		});

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
			  headers: {"Content-Type" :"application/json"},
			  data: JSON.stringify({ todo: strTodo })
			})
			  .done(function( res ) {
				  var $li = Template.getLi(res);
				  Template.addLi($ul, $li);
				  getCount(UNCOMPLETED,COMPLETION_MODE);
			  })
		}

		// 투두리스트 가져오는 함수
		// mode - 전체 검색이 아닌 조건을 걸 모드 ( 전체 검색 할지 아니면 완성 혹은 미완성 투두 개수 셀 것인지에 대한 변수)
		// (매개 변수 없이 호출 시 전체검색)
		// isCompleted - 완료한 일 가져올지 , 미완료한 일 가져올지에 대한 변수
		function getList(isCompleted, mode) {
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
		function getCount(isCompleted,mode) {
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

		// 투두 목록 1개 삭제하는 함수
		function removeTodo(id, $li) {
			$.ajax({
				method: "DELETE",
				url : "/api/todos/"+id,
				headers: {
					"X-HTTP-Method-Override" : "DELETE"}
			}).done(function( res ) {
				$li.slideUp("slow", function(){ $(this).remove(); })
				getCount(UNCOMPLETED, COMPLETION_MODE);

			})
		}

		// 배열로 이루어진 투두 목록을 삭제하는 함수
		// arrIdObj - id를 키로 갖는 객체 배열
		// $lists - jquery selector로, 지울 list 전체
		function removeTodoList(arrIdObj, $lists) {
			$.ajax({
				method: "DELETE",
				url : "/api/todos/",
				data : JSON.stringify(arrIdObj),
				headers: {
					"Content-Type" :"application/json",
					"X-HTTP-Method-Override" : "DELETE"}
			}).done(function( res ) {
				$lists.slideUp("slow", function(){ $(this).remove(); })
				getCount(UNCOMPLETED, COMPLETION_MODE);
			})
		}

	});
})(window, $);
