package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class AggregateDocument {

    String name;
    Map<String, Object> key;
    long docCount;
    Map<String, Object> value;

    public AggregateDocument() {
        this.name = "";
        this.key = new HashMap<>();
        this.docCount = 0;
        this.value = new HashMap<>();
    }

    public void putKey(String key1, Object key2) { key.put(key1, key2); }
    public void putValue(String val1, Object val2) { value.put(val1, val2); }
}
