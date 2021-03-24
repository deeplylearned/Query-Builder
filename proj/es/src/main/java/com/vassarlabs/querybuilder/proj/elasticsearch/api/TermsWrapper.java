package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class TermsWrapper {
    List<Number> terms;
}
