package com.vassarlabs.querybuilder.proj.ms.api;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Attribute {
	
	public Attribute() {
		super();
		// TODO Auto-generated constructor stub
	}

	private String fieldName;

    private String uiName;

    private String dataType;

    private Object childObject;
    
    private boolean searchTypeDropdown;   // true if searchType is dropdown

}