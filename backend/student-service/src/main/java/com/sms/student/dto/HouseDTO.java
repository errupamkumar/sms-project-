package com.sms.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseDTO {
    private Long id;
    private String houseName;
    private String houseColor;
}
