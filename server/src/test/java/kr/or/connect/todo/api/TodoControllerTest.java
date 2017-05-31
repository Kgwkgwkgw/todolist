package kr.or.connect.todo.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.domain.TodoCri;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TodoControllerTest {
	@Autowired
	WebApplicationContext wac;
	@Autowired
	ObjectMapper mapper;
	MockMvc mvc;
	private final static String uri = "/api/todos";
	private Todo todo;
	private TodoCri todoCri;
	private final Logger log = LoggerFactory.getLogger(TodoControllerTest.class);
	
	@Before
	public void setUp() {
		this.mvc = webAppContextSetup(this.wac)
			.alwaysDo(print(System.out))
			.build();
		todo = new Todo("바다가기", TodoCri.UNCOMPLETED);
		todoCri = new TodoCri(TodoCri.UNCOMPLETED);
	}
	
	@Test
	public void shouldCreate() throws Exception {
		
		mvc.perform(
			post(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(todo))
			)
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.todo").value(todo.getTodo()))
			.andExpect(jsonPath("$.completed").value(todo.getCompleted()))
			.andExpect(jsonPath("$.date").exists());
	}
	
	@Test
	public void shouldUpdateById() throws Exception {
		// 응답 response 문자열을 VO객체로 변환합니다. 
		todo = mapper.readValue(mvc.perform(
				post(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(todo))
			).andReturn().getResponse().getContentAsString(), Todo.class);
		
		log.info("inserted {}", todo);
		
		// todo 수정하기
		todo.setTodo("산가기");
		todo.setCompleted(1);
				
		mvc.perform(
			put(uri+"/"+todo.getId())
			.contentType(MediaType.APPLICATION_JSON)
			.content(mapper.writeValueAsString(todo))
		)
		.andExpect(status().isNoContent());
	}
	
	@Test
	public void shouldDeleteById() throws Exception { 
		mvc.perform(
				delete(uri+"/"+todo.getId())
				.contentType(MediaType.APPLICATION_JSON)
				)
				.andExpect(status().isNoContent());
	}  
	
	@Test
	public void shouldDeleteByCompleted() throws Exception { 
		mvc.perform(
				delete(uri)
				.content(mapper.writeValueAsString(todoCri))
				.contentType(MediaType.APPLICATION_JSON)
				)
				.andExpect(status().isNoContent());
	}
	
	@Test
	public void shouldCount() throws Exception {
		String completed = todoCri.getCompleted() == null ? "" : String.valueOf(todoCri.getCompleted());
		
		mvc.perform(
				get(uri+"/count")
				.param("completed", completed)
				)
				.andExpect(status().isOk());
	}
	
	@Test
	public void shouldSelect() throws Exception {
		String completed = todoCri.getCompleted() == null ? "" : String.valueOf(todoCri.getCompleted());
		
		mvc.perform(
				get(uri)
				.param("completed", completed)
				)
				.andExpect(status().isOk());
	}

}
