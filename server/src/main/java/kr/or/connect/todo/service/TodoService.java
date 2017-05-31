package kr.or.connect.todo.service;

import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.domain.TodoCri;
import kr.or.connect.todo.persistence.TodoDao;

@Service
public class TodoService {
	
	private final Logger log = LoggerFactory.getLogger(TodoService.class);

	private TodoDao todoDao;
	
	@Autowired
	public TodoService(TodoDao todoDao){
		this.todoDao = todoDao;
	}
	
	public Todo findById(Integer id) {
		return todoDao.selectById(id);
	}
	
	public Collection<Todo> findByCri(TodoCri todoCri) {
		if(todoCri.getCompleted()!=null)
			return todoDao.selectByCompleted(todoCri.getCompleted());
		else
			return todoDao.selectAll();
	}
	
	public Integer calcCountByCri(TodoCri todoCri) {
		if(todoCri.getCompleted()!=null)
			return todoDao.countByCompleted(todoCri.getCompleted());
		else 
			return todoDao.countAll();
	}
	
	public Todo create(Todo todo) {
		Integer id = todoDao.insert(todo);
		return findById(id);
	}
	
	public Integer removeByCri(TodoCri todoCri) {
		return todoDao.deleteByCompleted(todoCri.getCompleted());
	}
	
	public Integer removeById(Integer id) {
		return todoDao.deleteById(id);
	}
	
	public Integer modify(Integer id, Todo newTodo) {
		Todo oldTodo = todoDao.selectById(id);
		setModified(oldTodo, newTodo);
		log.info("{}", oldTodo);
		return todoDao.update(oldTodo);
	}
	// 수정할 Todo 필드가 있으면 변경합니다. 
	// 수정 가능 필드 : completed, todo 
	private void setModified(Todo oldTodo, Todo modifiedTodo) {
		if(modifiedTodo.getCompleted()!=null)
			oldTodo.setCompleted(modifiedTodo.getCompleted());
		else if(modifiedTodo.getTodo()!=null)
			oldTodo.setTodo(modifiedTodo.getTodo());
	}
}
