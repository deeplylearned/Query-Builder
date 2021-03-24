//Give UI names in the hie constants
export const DrillDownConstants = {
    // DRILL_HIE : {
    //     "state" : [
    //         "district",
    //         "university",
    //         "constituency"
    //     ],
    //     "district" : [
    //         "mandal"
    //     ],
    //     "mandal" : [
    //         "college"
    //     ],
    //     "college" : [
    //         "student"
    //     ],
    //     "university" : [
    //         "college"
    //     ],
    //     "constituency" : [
    //         "district"
    //     ]
    // },
    DRILL_HIE : {
        "state" : [
            "district_id",
            "univ_id"
        ],
        "District Id" : [
            "Mandal Id"
        ],
        "Mandal Id" : [
            "Village Id"
        ],
        "Univ Id" : [
            "Mandal Id"
        ]
    },
    DATATYPE_MAPPING : {
        "int" : "NUMBER",
        "float" : "NUMBER",
        "string" : "TEXT",
        "text" : "TEXT",
        "long" : "NUMBER"
    },
    HIE_LEVELS : ["State", "Univ Id", "District Id", "Mandal Id", "Village Id"]
    // HIE_LEVELS : ["state", "district", "mandal", "college", "student", "parent_name", "entity_type", "entity_name", "district_id"]
}