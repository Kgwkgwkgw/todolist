(function ($) {
  'use strict';
  window.todo = window.todo || {};
  window.todo.common = (function() {
    // 팝업 최상위 엘레멘트
    var popupArea =".popup_area";
    // 로딩 최상위 엘레멘트
    var loadingArea =".loading_area";
    // 팝업 닫기 버튼
    var popupCloseBtn =".btn_close";
    // 숨기기 처리하는 클래스
    var hide = ".hide";

    // 이벤트 리슨할 객체 배열
    // className : 이벤트 리슨할 클래스 명
    // delegationWrapper : 이벤트 딜리게이션 타겟
    // eventToListen : 추가하고 싶은 이벤트를 배열안에 객체형식으로 작성합니다.
    var arrEventInfo = [
      {
        className : popupCloseBtn,
        delegationWrapper : popupArea,
        eventToListen : [
          {
            event : "click",
            handling : function(e) {
              // .className -> className
        				$(popupArea).addClass(hide.slice(1));
                // 스크롤 가능하게 바꿈
                $("body").css("overflow", "auto");
        		}
          }
        ]
      }
    ];
    // arrEventInfo 정보 기반으로 이벤트 델리게이션 혹은 바인딩해주는
    // eventlistening 추가 함수
    function addEventHandling (arrEventInfo) {
      $.each(arrEventInfo, function(index, obj){
        $.each(obj.eventToListen, function(index, eventObj) {
          //이벤트 델리게이션 방식
          if(obj.delegationWrapper!=undefined)
            $(obj.delegationWrapper).on(eventObj.event, obj.className, eventObj.handling);
          //이벤트 바인딩 방식
          else
            $(obj.className).on(eventObj.event, eventObj.handling);
        });
      });
    };
    // 화면에  출력하는 함수
    // $parent는 element추가할 부모 엘레멘트, jquery selector
    // $child는 추가할 element, jquery selector
    // isReset은 부모 엘레멘트 하위 엘레멘트를  비울지 말지에 대한 변수(true/false)
    function render ($parent, $child, isReset) {
        isReset = isReset || false;
        if(isReset)
          $parent.empty();

        $parent.prepend($child);
    };

    function popup (title, content, close_text) {
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

      // 출력하기
      render($(popupArea), $layer_wrap, true);
      // 딤드 배경 보여주기
      $(popupArea).removeClass(hide.slice(1));
      // 스크롤 막음
      $("body").css("overflow", "hidden");
    };

    // 로딩 중 화면 보여줬다 없앴다 하는 함수
    function toggleLoading () {
      // .className -> className
      $(loadingArea).toggleClass(hide.slice(1));
    };

    // ajax 호출 실패 시 팝업 노출
    function handlingAjaxError () {
      $(document).ajaxError(function (event, xhr, ajaxOptions, thrownError) {
          console.log(xhr);
          popup("알림", "일시적 오류가 발생하였습니다.", "확인");
      });
    };

    function init () {
      addEventHandling(arrEventInfo);
      handlingAjaxError();
    }

    return {
      popup : popup,
      addEventHandling : addEventHandling,
      render : render,
      toggleLoading : toggleLoading,
      init : init
    }
  })();
})(jQuery);
