package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.Data;
import org.elasticsearch.common.xcontent.XContentType;

import java.util.Map;

@Data
public class SourceDocument {

    protected String id;
    protected String index;
    protected XContentType type;
    protected Map<String, Object> source;

    public SourceDocument() { }

    public SourceDocument(String id, String index, Map<String, Object> source) {
        this.id = id;
        this.index = index;
        this.source = source;
    }

    public SourceDocument(String id, String index, XContentType type, Map<String, Object> source) {
        this.id = id;
        this.index = index;
        this.type = type;
        this.source = source;
    }
}

