package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.Data;

import java.rmi.server.UID;

@Data
public class ApiResponse {

    private String id = (new UID()).toString();
    private ApiResult result;

    public void setResult(Boolean success, Integer status, Object content) {
        this.result = new ApiResult(success, status, (Object)null, content);
    }

    public void setResult(Boolean success, Integer status, Object metadata, Object content) {
        this.result = new ApiResult(success, status, metadata, content);
    }
}
