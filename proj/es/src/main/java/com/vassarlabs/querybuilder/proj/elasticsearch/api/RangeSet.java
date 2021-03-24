package com.vassarlabs.querybuilder.proj.elasticsearch.api;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RangeSet {
int Lte, Gte,lt,gt;
}
