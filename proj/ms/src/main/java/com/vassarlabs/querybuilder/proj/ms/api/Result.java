package com.vassarlabs.querybuilder.proj.ms.api;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

import com.vassarlabs.querybuilder.proj.elasticsearch.api.ApiResponse;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Result {
	
	public Result() {
		super();
		// TODO Auto-generated constructor stub
	}

	private ResponseEntity<byte[]> file;
    private ApiResponse data;


}