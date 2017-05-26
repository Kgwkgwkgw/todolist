package kr.or.connect.todo.handler;

import java.util.HashMap;
import java.util.Map;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import kr.or.connect.todo.domain.ApiError;


@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
	
	// MethodArgumentNotValidException - @Valid failed validation 
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
	  MethodArgumentNotValidException ex, 
	  HttpHeaders headers, 
	  HttpStatus status, 
	  WebRequest request) {
		Map<String, Object> errors = new HashMap<>();
	    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
	        errors.put(error.getField(), error.getDefaultMessage());
	    }
	    for (ObjectError error : ex.getBindingResult().getGlobalErrors()) {
	        errors.put(error.getObjectName(), error.getDefaultMessage());
	    }
	     
	    ApiError apiError = 
	      new ApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage(), errors);
	    return handleExceptionInternal(ex, apiError, headers, apiError.getStatus(), request);
	}
	
	// MissingServletRequestParameterException - Request param missing 
	@Override
	protected ResponseEntity<Object> handleMissingServletRequestParameter(
	  MissingServletRequestParameterException ex, HttpHeaders headers, 
	  HttpStatus status, WebRequest request) {
		Map<String, Object> error = new HashMap<>();
	    error.put(ex.getParameterName(), "parameter mssing");
	     
	    ApiError apiError = 
	      new ApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage(), error);
	    return new ResponseEntity<Object>(apiError, new HttpHeaders(), apiError.getStatus());
	}
	
	// ConstraintViolationException  - constraint violations 
	@ExceptionHandler({ ConstraintViolationException.class })
	public ResponseEntity<Object> handleConstraintViolation(
	  ConstraintViolationException ex, WebRequest request) {
		Map<String, Object> errors = new HashMap<>();
	    for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
	        errors.put(violation.getRootBeanClass().getName(), 
	        		violation.getPropertyPath() + ": " + violation.getMessage());
	    }
	 
	    ApiError apiError = 
	      new ApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage(), errors);
	    return new ResponseEntity<Object>(apiError, new HttpHeaders(), apiError.getStatus());
	}
	
	// MethodArgumentTypeMismatchException - argument missmatching
	@ExceptionHandler({ MethodArgumentTypeMismatchException.class })
	public ResponseEntity<Object> handleMethodArgumentTypeMismatch(
	MethodArgumentTypeMismatchException ex, WebRequest request) {
		Map<String, Object> error = new HashMap<>();
		error.put(ex.getName(), "should be of type " + ex.getRequiredType().getName());
		ApiError apiError = 
			new ApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage(), error);
		return new ResponseEntity<Object>(apiError, new HttpHeaders(), apiError.getStatus());
	}
}