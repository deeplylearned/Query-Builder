package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.Data;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
public class FlattenedPOJO {
    List<LinkedHashMap<String, Object>> FormatList;
    Map<String,Integer> columnMap;
}
