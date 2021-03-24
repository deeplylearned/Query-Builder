package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import org.elasticsearch.script.ScriptType;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.*;

@Data
@AllArgsConstructor
public class ScriptQuery {
    ScriptType scriptType;
    String language;
    String code;
    Map<String,Object> params;

    public ScriptQuery() {
        scriptType = null;
        language = null;
        code = null;
        params = null;
    }

}
