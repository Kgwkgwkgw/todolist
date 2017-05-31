package kr.or.connect.todo.domain;

public class TodoCri {
	// 1 - 완료 
	// 0 - 미완료
	public static Integer COMPLETED = 1;
	public static Integer UNCOMPLETED = 0;
	
	private Integer completed;
	public TodoCri() {
		
	}
	public TodoCri(Integer completed) {
		this.completed = completed;
	}
	public Integer getCompleted() {
		return completed;
	}

	public void setCompleted(Integer completed) {
		this.completed = completed;
	}

	@Override
	public String toString() {
		return "TodoCri [completed=" + completed + "]";
	}
}
