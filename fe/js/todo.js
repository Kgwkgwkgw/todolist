window.todo = window.todo || {};
window.todo.main = (function ($, common){
  'use strict';
  // 공백으로만 이루어져있지는 않은지 검사하는 정규식
  var regCheckNoWhitespace = /.*\S+.*/;
  var UNCOMPLETED = 0;
  var COMPLETED = 1;
  var TODOAPIURL = "/api/todos"
  // 투두 앱 시작
  var todoApp =".todoapp";
  // 투두 리스트 감싸는 엘레멘트 (델리게이션 목적)
  var todoWrapper = ".main";
  // 투두 리스트 ul 클래스 이름
  var todoUl = ".todo-list";
  // 투두 리스트 li 클래스 이름
  var todoLi = ".item";
  // 투두 리스트 완료/미완료 토글하는 클래스 이름
  var todoLiToggle = ".completed";
  // 투두 리스트 수정할때 추가하는 클래스 이름
  var todoLiEditing = ".editing";
  // 투두 리스트 인덱스 속성명
  var todoId = "data-id"
  // 투두 리스트 인풋창 클래스 이름
  var todoInput = ".new-todo";
  //투두 리스트 수정 버튼 클래스 이름
  var editBtn = ".edit";
  // 투두 리스트마다 있는  완료/미완료 해주는 버튼 클래스 이름
  var completionBtn = "._btnComplete";
  // 투두 리스트마다 있는 삭제 버튼 클래스 이름
  var destroyBtn = "._btnDestroy";
  // 투두 리스트 중 완료한 목록 삭제하는 버튼 클래스 이름
  var destroyCompletedBtn ="._clearCompleted";
  // 필터기능 하는 버튼 공통 클래스 이름
  var filterCommonBtn = "._btn_filter";
  // 필터기능 하는 버튼 공통 토글 클래스 (선택시 추가/제거)
  var filterCommonToggle = ".selected";
  // 투두 리스트 모두 보여주는 버튼 클래스 이름
  var filterAllbtn = ".btn_all";
  // 투두 리스트 아직 완료되지 않은 목록 보여주는 클래스 이름
  var filterActiveBtn =".btn_active";
  // 투두 리스트 완료한 목록 보여주는 클래스 이름
  var filterCompletedBtn =".btn_completed";
  // 투두 리트스 미완료 목록 개수 출력하는 클래스 이름
  var count = "._count";


  // 이벤트 리슨할 객체 배열
  // className : 이벤트 리슨할 클래스 명
  // delegationWrapper : 이벤트 딜리게이션 타겟
  // eventToListen : 추가하고 싶은 이벤트를 배열안에 객체형식으로 작성합니다.
  var arrEventInfo = [
    {
      className : todoLi,
      delegationWrapper : todoWrapper,
      eventToListen : [
        {
          event : "dblclick",
          handling : function(e) {
            // .className -> className
            $(this).addClass(todoLiEditing.slice(1));
          }
        }
      ]
    },

    {
      className : todoInput,
      eventToListen : [
        {
          event : "keydown",
          handling : function(e) {
      			// 엔터키 눌렸을 떄
      			if(e.which == 13) {
      				var entered = $(this).val();
              // 공백으로만 이루어져 있는지 테스트
      				if(regCheckNoWhitespace.test(entered)) {
      						addTodo($(this).val());
      				}
      				else {
      					common.popup("알림", "내용을 입력 해주세요^^", "확인");
      				}
      				// 인풋 값 초기화
      				$(this).val('');
      			}
      		}
        }
      ]
    },

    {
      className : editBtn,
      delegationWrapper : todoWrapper,
      eventToListen : [
        {
          event : "keydown",
          handling : function(e) {
      			// 엔터키 눌렸을 떄
      			if(e.which == 13) {
      				var entered = $(this).val();
      				if(regCheckNoWhitespace.test(entered)) {
      						var $li = $(this).parents(todoLi);
      						editTodo($li.attr(todoId), $(this).val(), $li);
      				}
      				else {
      					common.popup("알림", "내용을 입력 해주세요^^", "확인");
      				}
      				// 인풋 값 초기화
      				$(this).val('');
      			}
      		}
        }
      ]
    },

    {
      className : completionBtn,
      delegationWrapper : todoWrapper,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      			var $li = $(this).parents(todoLi);
            // .className -> className
      			var currentStatus = $li.hasClass(todoLiToggle.slice(1)) ? COMPLETED : UNCOMPLETED;
      			// ( status toggle)
      			var tobeStatus = (currentStatus == COMPLETED) ? UNCOMPLETED : COMPLETED ;
      			var id = $li.attr(todoId);

      			toggleCompletion($li, tobeStatus, id);
      		}
        }
      ]
    },

    {
      className : destroyBtn,
      delegationWrapper : todoWrapper,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      			var $li = $(this).parents(todoLi);
      			var id = $li.attr(todoId);

      			removeTodo(id, $li);
      		}
        }
      ]
    },

    {
      className : destroyCompletedBtn,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      				var $completedLi = $(todoLiToggle);
      				var arrIdObj = [];

      				// 삭제할 투두의 id를 키로 갖는 객체 배열 생성
      				$completedLi.each(function(index) {
      					var id = $(this).attr(todoId);
      					var obj = {};
      					obj["id"] = id;
      					arrIdObj.push(obj);
      				});
              // 완료한 항목 삭제
      				removeTodoList(COMPLETED, $completedLi);
      		}
        }
      ]
    },

    {
      className : filterCommonBtn,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      			// a태그 기본 이벤트 막음
      				e.preventDefault();
              // .className -> className
      				$(filterCommonBtn).removeClass(filterCommonToggle.slice(1));
      				$(this).addClass(filterCommonToggle.slice(1));
      		}
        }
      ]
    },

    {
      className : filterAllbtn,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      			getList();
      		}
        }
      ]
    },

    {
      className : filterActiveBtn,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      			getList(UNCOMPLETED);
      		}
        }
      ]
    },

    {
      className : filterCompletedBtn,
      eventToListen : [
        {
          event : "click",
          handling : function(e) {
      			getList(COMPLETED);
      		}
        }
      ]
    }
  ];

  // 투두 완료/미완료 처리 함수
  // $li는 투두 리스트의 jquery selector
  // tobeStatus는 바꾸고 싶은 값 (완료/ 미완료)
  // id는 투두리스트 id
  function toggleCompletion($li, tobeStatus, id) {
    $.ajax({
      method: "PUT",
      url : TODOAPIURL+"/"+id,
      headers: {
        "Content-Type" :"application/json",
        "X-HTTP-Method-Override" : "PUT"},
      data: JSON.stringify({ completed : tobeStatus })
    }).done(function( res ) {
      // .className -> className
      $li.toggleClass(todoLiToggle.slice(1));
      getCount(UNCOMPLETED);
    });
  }

  // 투두 추가 처리 함수
  //strTodo는 투두 텍스트
  function addTodo(strTodo) {
    $.ajax({
      method: "POST",
      url: TODOAPIURL,
      headers: {"Content-Type" :"application/json"},
      data: JSON.stringify({ todo: strTodo })
    })
      .done(function( res ) {
        // 등록된 투두 추가함!
        var $li = getLi(res);
        common.render($(todoUl), $li);
        getCount(UNCOMPLETED);
      })
  }

  // 투두 수정 처리 함수
  // id는 투두 아이디
  // strTodo는 투두 텍스트
  // $li는 투두 리스트 li, jquery selector
  function editTodo(id, strTodo, $li) {
    $.ajax({
      method: "PUT",
      url : TODOAPIURL+"/"+id,
      headers: {
        "Content-Type" :"application/json",
        "X-HTTP-Method-Override" : "PUT"},
      data : JSON.stringify({"todo" : strTodo})
    })
      .done(function(res) {
          $li.find("label").text(strTodo);
          $li.removeClass(todoLiEditing.slice(1));
      })
  }

  // 투두리스트 가져오는 함수
  // (매개 변수 없이 호출 시 전체검색)
  // isCompleted - 완료한 일 가져올지 , 미완료한 일 가져올지에 대한 변수
  function getList(isCompleted) {

    $.ajax({
      method: "GET",
      url: TODOAPIURL,
      headers: {"Content-Type" :"application/json"},
      beforeSend: function()
        {
            $(todoUl).empty();
            common.toggleLoading();
        },
      data : {
        completed: isCompleted
        }
    }).done(function( res ) {
      $.each(res, function(idx, obj){
        var $li = getLi(obj);
        common.render($(todoUl),$li);
      })
      // 미 완료 투두 개수 세기
      getCount(UNCOMPLETED);
      common.toggleLoading();
    });
  }

  // 투두 개수 세는 함수
  // (매개 변수 없이 호출 시 전체검색)
  // isCompleted - 완료한 일 셀지, 미완료한 일 셀지에대한 변수
  function getCount(isCompleted) {

    $.ajax({
      method: "GET",
      url: TODOAPIURL+"/count",
      data : {
          completed: isCompleted
          }
    }).done(function(res){
      $(count).text(res);
    });
  }

  // 투두 목록 1개 삭제하는 함수
  // id는 투두 리스트 id
  // $li는 투두 리스트 li, jquery selector
  function removeTodo(id, $li) {
    $.ajax({
      method: "DELETE",
      url : TODOAPIURL+"/"+id,
      headers: {
        "X-HTTP-Method-Override" : "DELETE"}
    }).done(function( res ) {
      $li.slideUp("slow", function(){ $(this).remove(); })
      getCount(UNCOMPLETED);

    })
  }

  // 배열로 이루어진 투두 목록을 삭제하는 함수
  // completed - 완료 혹은 미완료 투두 삭제
  // $lists - jquery selector로, 지울 list 전체
  function removeTodoList(completed, $lists) {
    $.ajax({
      method: "DELETE",
      url : TODOAPIURL,
      data : JSON.stringify({
        completed : completed
      }),
      headers: {
        "Content-Type" :"application/json",
        "X-HTTP-Method-Override" : "DELETE"}
    }).done(function( res ) {
      $lists.slideUp("slow", function(){ $(this).remove(); })
      getCount(UNCOMPLETED);
    })
  }

  function getLi(objTodo) {
    // slice(1)은 .className -> className
    var $li = $("<li>").addClass(todoLi.slice(1)).attr(todoId, objTodo.id);
    var $div = $("<div class='view'>");
    var $checkbox = $("<input class='toggle' type='checkbox'>").addClass(completionBtn.slice(1));
    var $label = $("<label>");
    var $button = $("<button class='destroy'>").addClass(destroyBtn.slice(1));
    var $text_edit = $("<input type='text'>").addClass(editBtn.slice(1));

    // 완료 상태일 때 필요한 클래스들 추가
    if(objTodo.completed === COMPLETED){
      $checkbox.attr("checked", true);
      $li.addClass(todoLiToggle.slice(1));
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

  return {
    init : function() {
      //todo 이벤트 리스닝
      common.addEventHandling(arrEventInfo);
      //투두 리스트 가져오기
      getList();
    }
  }

})(jQuery, window.todo.common);
