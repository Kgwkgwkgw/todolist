package kr.or.connect.todo.domain;

public class TodoCri {
	// 1 - 완료 
	// 0 - 미완료
	public static Integer COMPLETED = 1;
	public static Integer UNCOMPLETED = 0;
	// 검색 모드 
	// ALL_MODE - 전체 검색 
	// COMPLETION_MODE - COMPLTED 혹은 UNCOMPLETED로 검색 
	public static String COMPLETION_MODE = "COMPLETION";
	public static String ALL_MODE = "ALL";
	
	private Integer completed;
	private String filtering;
	
	//디포트 값 
	public TodoCri() {
		this.completed = 0;
		this.filtering = null;
	}
	
	@Override
	public String toString() {
		return "TodoCri [completed=" + completed + ", filtering=" + filtering + "]";
	}

	public Integer getCompleted() {
		return completed;
	}

	public void setCompleted(Integer completed) {
		this.completed = completed;
	}

	public String getFiltering() {
		return filtering;
	}

	public void setFiltering(String filtering) {
		this.filtering = filtering;
	}

	public TodoCri(Integer completed, String filtering) {
		this.completed = completed;
		this.filtering = filtering;
	}
	
}
