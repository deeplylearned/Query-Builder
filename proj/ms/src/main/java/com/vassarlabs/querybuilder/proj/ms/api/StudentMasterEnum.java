package com.vassarlabs.querybuilder.proj.ms.api;

import java.util.HashMap;
import java.util.Map;


public enum StudentMasterEnum {

    Academic_Year("acYear"),
    Caste_Code("casteCode"),
    College_Code("collegeCode"),
    Course_Code("courseCode"),
    Course_Year("courseYear"),
    Dept_Code("deptCode"),
    Entity_Id("entityId"),
    Entity_Name("entityName"),
    Entity_Type("entityType"),
    Fresh_Renewal("freshRenewal"),
    Gender("gender"),
    Mandal_Code("mandalCode"),
    Month_Data("monthData"),
    Sch_Type("schType"),
    Univ_Code("univCode"),
    District_Code("distCode"),

    CfmsDesc("cfmsDesc"),
    CfmsStatus("cfmsStatus"),
    ESignId("eSignId"),
    Financial_Year("financialYear"),
    Month_Eligible("monthEligible"),
    Mtf_Demand("mtfDemand"),
    Mt_fRelease("mtfRelease"),
    Proceedings_No("proceedingsNo"),
    Rtf_Demand("rtfDemand"),
    Rtf_Release("rtfRelease"),
    Tbr_Date("tbrDate"),
    Tbr_No("tbrNo"),
    Trans_Completed_Date("transCompletedDate"),
    Bill_Generated_Date("billGeneratedDate"),

    _0("0"),
    Jan("1"),
    Oct("10"),
    _100("100"),
    _101("101"),
    _1012("1012"),
    _102("102"),
    _1022("1022"),
    _1023("1023"),
    _103("103"),
    _1032("1032"),
    _1033("1033"),
    _104("104"),
    _1041("1041"),
    _1042("1042"),
    _1043("1043"),
    Nov("11"),
    Dec("12"),
    _13("13"),
    Feb("2"),
    Mar("3"),
    Apr("4"),
    May("5"),
    Jun("6"),
    Jul("7"),
    Aug("8"),
    Sep("9");





    private final String value;
    private static final Map<String, StudentMasterEnum> fieldNameToUiNameMap = new HashMap<String, StudentMasterEnum>();

    static {
        for (StudentMasterEnum myEnum : values()) {
            fieldNameToUiNameMap.put(myEnum.getValue(), myEnum);
        }
    }
    StudentMasterEnum(final String newValue) {
        value = newValue;
    }

    public String getValue() {
        return value;
    }

    public static StudentMasterEnum getUINameForStringKey(String key) {
        return fieldNameToUiNameMap.get(key);
    }

    public static StudentMasterEnum getUINameForEnumKey(StudentMasterEnum key) {
        // TODO Auto-generated method stub
        return fieldNameToUiNameMap.get(key);
    }

}

