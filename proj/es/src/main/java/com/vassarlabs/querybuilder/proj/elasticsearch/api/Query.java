package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import org.elasticsearch.script.Script;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class Query {
    Map<String, String> terms;
    Map<String, Script> script;

    public Query() {
        terms = new HashMap<>();
        script = new HashMap<>();
    }


    public void putTerms(String name, String field) { this.terms.put(name, field); }
    public void putScript(String name, Script code) { this.script.put(name, code);}
}
