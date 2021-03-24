package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResult {

    private Boolean success;

    private Integer status;

    private Object metadata;

    private Object content;

}

