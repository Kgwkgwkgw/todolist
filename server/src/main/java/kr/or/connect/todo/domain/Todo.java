package kr.or.connect.todo.domain;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

public class Todo {
	private int id;
	public Todo() {
		
	}
	public Todo(String todo) {
		this.todo = todo;
	}
	public Todo(String todo, Integer completed) {
		this.todo = todo;
		this.completed = completed;
	}
	@NotNull
	@NotBlank(message="내용을 입력 해주세요.")
	private String todo;
	private Integer completed;
	private Date date;
	
	public int getId() {
		return id;
	}
	@Override
	public String toString() {
		return "Todo [id=" + id + ", todo=" + todo + ", completed=" + completed + ", date=" + date + "]";
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTodo() {
		return todo;
	}
	public void setTodo(String todo) {
		this.todo = todo;
	}
	public Integer getCompleted() {
		return completed;
	}
	public void setCompleted(Integer completed) {
		this.completed = completed;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
}
