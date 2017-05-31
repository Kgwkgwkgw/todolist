package kr.or.connect.todo.persistence;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.domain.TodoCri;


@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TodoDaoTest {
	@Autowired
	TodoDao todoDao;
	Todo todo;
	TodoCri todoCri;
	private final Logger log = LoggerFactory.getLogger(TodoDaoTest.class);
	
	@Before
	public void setUp() {
		todo = new Todo("바다가기");
		todoCri = new TodoCri(TodoCri.UNCOMPLETED);
	}
	
	@Test
	public void shouldSelectAll() {
		//when
		List<Todo> allTodos = todoDao.selectAll();
		int counted = todoDao.countAll();
		//then
		assertThat(allTodos, is(notNullValue()));
		assertThat(counted , is(allTodos.size()));
		
		log.info("Todo list : {}", allTodos);
	}
	
	@Test
	public void shouldSelectByCompleted() {
		//when 
		int counted = todoDao.countByCompleted(todoCri.getCompleted());
		List<Todo> allTodos = todoDao.selectByCompleted(todoCri.getCompleted());
		
		//then
		assertThat(allTodos, is(notNullValue()));
		assertThat(counted , is(allTodos.size()));
		log.info("Todo list(ByCompleted) : {}", allTodos);
	}

	@Test
	public void shouldInsertAndSelect() {
		// when
		Integer id = todoDao.insert(todo);

		// then
		Todo selected = todoDao.selectById(id);
		log.info("inserted todo : {}", selected);
		assertThat(selected.getTodo(), is(todo.getTodo()));
	}
	@Test
	public void shouldDeleteById() {
		// Given
		Integer id = todoDao.insert(todo);

		// when
		int affected = todoDao.deleteById(id);

		// Then
		assertThat(affected, is(1));
	}
	
	@Test
	public void shouldDeleteByCompleted() {
		// Given
		int count = todoDao.countByCompleted(todoCri.getCompleted());
		
		// When 
		int affected = todoDao.deleteByCompleted(todoCri.getCompleted());
		// Then
		assertThat(affected, is(count));
	}
	
	@Test
	public void shouldInsertAndUpdate() {
		// Given
		Integer id = todoDao.insert(todo);

		// When
		todo.setId(id);
		
		// 완성한 걸로 수정
		todo.setCompleted(TodoCri.COMPLETED);
		// todo 내용 수정
		todo.setTodo("수정 후");
		int affected = todoDao.update(todo);

		// Then
		assertThat(affected, is(1));
	}
}
